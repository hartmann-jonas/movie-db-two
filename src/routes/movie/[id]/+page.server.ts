import type { PageServerLoad } from './$types';
import type { Action, Actions } from './$types';
import { database } from '$lib/database';
import { error, fail } from '@sveltejs/kit'

import 'dotenv/config'

export const load: PageServerLoad = async ({params, locals}) => {
    const startTime = Date.now()
    let likes = 0;
    let liked = undefined;
    let favorited = undefined;
    const { id } = params;
    const movieId = Number(id);
    const apiKey = process.env.TMDB_API_KEY;
    // const movieId = Number(id)
    // fetch both requests simultaneously
    const [movieDetailResponse, movieAvailabilityResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,keywords,recommendations`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`)
    ]);
    const movieDetail = await movieDetailResponse.json();
    const movieAvailability = await movieAvailabilityResponse.json();
    if(movieDetailResponse.ok && movieAvailabilityResponse.ok) {
        // if movie exists try to find the likes of the movie in the database
        const likesResult = await database.movie.findFirst({
            where: {
                id: movieId
            },
            include: {
                likes: true
            }
        })
        if(likesResult) {
            likes = likesResult.likes.length
            console.log(likes + ' likes')
        } else {
            console.log('Movie has no likes')
        }
        // if the user is logged in check if he has liked or saved the movie
        if(locals.user) {
            const userId = locals.user.id
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
            if(userResult) {
                favorited = userResult.favorite_movies.length > 0
                liked = userResult.liked_movies.length > 0
            }
        }
        const endTime = Date.now()
		console.log('Time for fetching data: ' + (endTime - startTime) + 'ms')
        return {
            props: {
                favorited,
                liked,
                likes,
                movieDetail,
                movieAvailability
            }
        };
    }
    throw error(404, 'not found')
}

export const actions: Actions = {
	//Store movie as favourite
	saveMovie: async ({ locals, params }) => {
        if(locals.user.id) {
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
                if(likesResult) {
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
                return fail(400, {error: 'saving movie failed'})
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

	// Remove movie from favourites
	unsaveMovie: async ({ locals, params }) => {
        if(locals.user.id) {
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
                if(likesResult) {
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
                return fail(400, {error: 'unsaving the movie failed'})
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

	// add movie to liked movies of given user
	likeMovie: async ({ locals, params }) => {
		console.log("LIKING MOVIE")
		if(locals.user.id) {
			const movieId = Number(params.id)
			const userId = locals.user.id
            let movie = undefined
            let genres = undefined
			const response = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.TMDB_API_KEY}`)
            if(response.ok) {
                movie = await response.json()
                genres = await movie.genres
            }
            console.log('Movie ID:  '+ movieId)
			console.log('User:  ' + userId)
            // link all the genres to the movie
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
                    return fail(400, {error: 'liking the keywords failed'})
                }
            }
		} else {
			throw error(400, "no user id found")
		}
	},

	// remove user from liked of given movie
	unlikeMovie: async ({ locals, params }) => {
		if (locals.user.id) {
			const movieId = Number(params.id)
			const userId = locals.user.id
			console.log('Movie ID:  '+ movieId)
			console.log('User:  ' + userId)
			try {
				await database.movie.update({
					where:{
						id:movieId
					},
					data:{
						likes:{
							disconnect:{
								id:userId
							}
						}
					}
				})
			}
			catch (e) {
				console.log(e)
				return fail(400, {error: "liking the movie failed"})
			}
		} else {
			throw error(400, "no user id found")
		}
	},
}
