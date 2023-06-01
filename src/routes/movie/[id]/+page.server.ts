import type { PageServerLoad } from './$types'
import type { Action, Actions } from './$types'
import { database } from '$lib/database'
import { error, fail } from '@sveltejs/kit'

import 'dotenv/config'

export const load: PageServerLoad = async ({ params, locals }) => {
    const { id } = params
    const movieId = Number(id)
    const apiKey = process.env.TMDB_API_KEY
    // fetch both requests simultaneously
    const [movieDetailResponse, movieAvailabilityResponse] = await Promise.all([
        fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,keywords,recommendations`
        ),
        fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`)
    ]);
    const movieDetail = await movieDetailResponse.json()
    const movieAvailability = await movieAvailabilityResponse.json()
    if (movieDetailResponse.ok && movieAvailabilityResponse.ok) {
        return {
            props: {
                movieDetail,
                movieAvailability,
                streamed: {
                    userInteractions: new Promise(async (fulfil) => {
                        let favorited = false
                        let liked = false
                        // if the user is logged in check if he has liked or saved the movie
                        if (locals.user) {
                            const userId = locals.user.id;
                            const userResult = await database.user.findUnique({
                                where: {
                                    id: userId
                                },
                                select: {
                                    favorite_movies: {
                                        where: {
                                            id: movieId
                                        }
                                    },
                                    liked_movies: {
                                        where: {
                                            id: movieId
                                        }
                                    }
                                }
                            })
                            if (userResult) {
                                favorited = userResult.favorite_movies.length > 0;
                                liked = userResult.liked_movies.length > 0;
                                console.log('User interactions load finished.')
                                fulfil({
                                    liked: liked,
                                    favorited: favorited,
                                    user: true
                                })
                            }
                        } else {
                            fulfil({
                                user: false,
                            })
                        }
                    }),
                    likes: new Promise(async (fulfil) => {
                        let likes
                        // if movie exists try to find the likes of the movie in the database
                        const likesResult = await database.movie.findFirst({
                            where: {
                                id: movieId
                            },
                            include: {
                                _count: {
                                    select: {
                                        likes: true
                                    }
                                }
                            }
                        })
                        if (likesResult) {
                            likes = likesResult._count.likes;
                            console.log(likes + ' likes');
                            console.log('Likes load finished.')
                            fulfil(likes)
                        } else if (likesResult == null) {
                            console.log('Movie has no likes');
                            fulfil(0)
                        }
                    }),
                    // TODO: make one big movieData to get likes and comments from db at the same time
                    comments: new Promise(async (fulfil) => {
                        let comments = []
                        // search comments for movie in db
                        const commentsResult = await database.movie.findFirst({
                            where: {
                                id: movieId
                            },
                            select: {
                                comments: {
                                    select: {
                                        user: true,
                                        comment: true
                                    }
                                }
                            }
                        })
                        if (commentsResult) {
                            comments = commentsResult.comments
                            console.log("Found comments")
                            // make comments go from new to old
                            comments = comments.reverse()
                            fulfil(comments)
                        } else if (commentsResult == null) {
                            console.log('Movie has no comments');
                            fulfil(0)
                        }
                    })
                }
            }
        };
    }
    throw error(404, 'not found');
}

export const actions: Actions = {
    //Store movie as favourite
    saveMovie: async ({ locals, params }) => {
        if (locals.user.id) {
            const movieId = Number(params.id)
            const userId = locals.user.id
            console.log('Save the movie:')
            console.log('MovieId: ' + movieId)
            console.log('User:    ' + userId)
            try {
                await database.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        favorite_movies: {
                            // relate movie to user, if movie doesnt exist reate and relate it
                            connectOrCreate: {
                                where: {
                                    id: movieId
                                },
                                create: {
                                    id: movieId
                                }
                            }
                        }
                    }
                })
                // fetch new amount of likes
                let likes
                const likesResult = await database.movie.findFirst({
                    where: {
                        id: movieId
                    },
                    include: {
                        likes: true
                    }
                })
                if (likesResult) {
                    likes = likesResult.likes.length
                    console.log(likes + ' likes')
                    return {
                        props: {
                            likes
                        }
                    }
                } else {
                    console.log('Movie has no likes')
                }
            } catch (e) {
                console.log(e)
                return fail(400, { error: 'saving movie failed' })
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

    // Remove movie from favourites
    unsaveMovie: async ({ locals, params }) => {
        if (locals.user.id) {
            const movieId = Number(params.id)
            const userId = locals.user.id
            console.log('Unsave the movie:')
            console.log('MovieId: ' + movieId)
            console.log('User:    ' + userId)
            try {
                await database.movie.update({
                    where: {
                        id: movieId
                    },
                    data: {
                        favorited_by: {
                            disconnect: {
                                id: userId
                            }
                        }
                    }
                })
                // fetch new amount of likes
                let likes
                const likesResult = await database.movie.findFirst({
                    where: {
                        id: movieId
                    },
                    include: {
                        likes: true
                    }
                })
                if (likesResult) {
                    likes = likesResult.likes.length
                    console.log(likes + ' likes')
                    return {
                        props: {
                            likes
                        }
                    }
                } else {
                    console.log('Movie has no likes')
                }
            } catch (e) {
                console.log(e);
                return fail(400, { error: 'unsaving the movie failed' })
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

    // add movie to liked movies of given user
    likeMovie: async ({ locals, params }) => {
        console.log('LIKING MOVIE')
        if (locals.user.id) {
            const movieId = Number(params.id)
            const userId = locals.user.id
            console.log(locals)
            let movie = undefined
            let genres = undefined
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.TMDB_API_KEY}`
            );
            if (response.ok) {
                movie = await response.json()
                genres = await movie.genres
            }
            console.log('Movie ID:  ' + movieId)
            console.log('User:  ' + userId)
            // link all the genres to the movie
            const start = Date.now()
            for await (const genre of genres) {
                console.log('Genre: ' + genre.name)
                try {
                    await database.movie.upsert({
                        where: {
                            id: movieId
                        },
                        update: {
                            genres: {
                                connectOrCreate: {
                                    where: {
                                        id: genre.id
                                    },
                                    create: {
                                        id: genre.id,
                                        genre: genre.name
                                    }
                                }
                            },
                            likes: {
                                connect: {
                                    id: userId
                                }
                            }
                        },
                        create: {
                            id: movieId,
                            genres: {
                                connectOrCreate: {
                                    where: {
                                        id: genre.id
                                    },
                                    create: {
                                        id: genre.id,
                                        genre: genre.name
                                    }
                                }
                            },
                            likes: {
                                connect: {
                                    id: userId
                                }
                            }
                        }
                    })
                } catch (e) {
                    console.log(e)
                    return fail(400, { error: 'liking the keywords failed' })
                }
            }
            const time = Date.now() - start
            console.log('TIME FOR DATABASE OPERATIONS: ' + time + 'ms')
        } else {
            throw error(400, 'no user id found')
        }
    },

    // remove user from liked of given movie
    unlikeMovie: async ({ locals, params }) => {
        if (locals.user.id) {
            const movieId = Number(params.id)
            const userId = locals.user.id
            console.log('Movie ID:  ' + movieId)
            console.log('User:  ' + userId)
            try {
                await database.movie.update({
                    where: {
                        id: movieId
                    },
                    data: {
                        likes: {
                            disconnect: {
                                id: userId
                            }
                        }
                    }
                })
            } catch (e) {
                console.log(e)
                return fail(400, { error: 'liking the movie failed' })
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

    writeComment: async ({ locals, params, request }) => {
        console.log('writing comment')
        if (locals.user.id) {
            const form = await request.formData()
            const comment = form.get('comment')?.toString()
            if (!comment) {
                return fail(400, { error: 'missing comment' })
            } else {
                const movieId = Number(params.id)
                const userId = locals.user.id
                console.log('Movie ID:  ' + movieId)
                console.log('User:  ' + userId)
                console.log('Comment: ' + comment)
                try {
                    await database.comments.create({
                        data: {
                            comment: comment,
                            user: {
                                connect: {
                                    id: userId
                                }
                            },
                            movie: {
                                connectOrCreate: {
                                    where: {
                                        id: movieId
                                    },
                                    create: {
                                        id: movieId
                                    }
                                }
                            },
                        }
                    })
                } catch (e) {
                    console.log(e)
                    return fail(400, { error: 'submitting the comment failed' })
                }
            }
        } else {
            console.log('no user logged in')
            throw error(400, 'no user id found')
        }
    }
}
