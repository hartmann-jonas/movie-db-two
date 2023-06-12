import type { PageServerLoad } from './$types'
import type { Action, Actions } from './$types'
import { database } from '$lib/database'
import { error, fail } from '@sveltejs/kit'

import 'dotenv/config'

export const load: PageServerLoad = async ({ params, locals }) => {
    const showId = Number(params.showId)
    const apiKey = process.env.TMDB_API_KEY
    // fetch both requests simultaneously
    const [showDetailResponse, showAvailabilityResponse] = await Promise.all([
        fetch(
            `https://api.themoviedb.org/3/tv/${showId}?api_key=${apiKey}&append_to_response=videos,keywords,recommendations`
        ),
        fetch(`https://api.themoviedb.org/3/tv/${showId}/watch/providers?api_key=${apiKey}`)
    ]);
    const showDetail = await showDetailResponse.json()
    const showAvailability = await showAvailabilityResponse.json()
    console.log(showDetail)
    if (showDetailResponse.ok && showAvailabilityResponse.ok) {
        return {
            props: {
                showDetail,
                showAvailability,
                streamed: {
                    userInteractions: new Promise(async (fulfil) => {
                        let favorited = false
                        let liked = false
                        // if the user is logged in check if he has liked or saved the show
                        if (locals.user) {
                            const userId = locals.user.id;
                            const userResult = await database.user.findUnique({
                                where: {
                                    id: userId
                                },
                                select: {
                                    favourite_shows: {
                                        where: {
                                            id: showId
                                        }
                                    },
                                    liked_shows: {
                                        where: {
                                            id: showId
                                        }
                                    }
                                }
                            })
                            if (userResult) {
                                favorited = userResult.favourite_shows.length > 0;
                                liked = userResult.liked_shows.length > 0;
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
                        // if show exists try to find the likes of the show in the database
                        const likesResult = await database.show.findFirst({
                            where: {
                                id: showId
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
                            console.log('show has no likes');
                            fulfil(0)
                        }
                    }),
                    // TODO: make one big showData to get likes and comments from db at the same time
                    comments: new Promise(async (fulfil) => {
                        let comments = []
                        // search comments for show in db
                        const commentsResult = await database.show.findFirst({
                            where: {
                                id: showId
                            },
                            select: {
                                comments: {
                                    include: {
                                        user: true
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
                            console.log('show has no comments');
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
    //Store show as favourite
    saveShow: async ({ locals, params }) => {
        if (locals.user.id) {
            const showId = Number(params.showId)
            const userId = locals.user.id
            console.log('Save the show:')
            console.log('showId: ' + showId)
            console.log('User:    ' + userId)
            try {
                await database.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        favourite_shows: {
                            // relate show to user, if show doesnt exist reate and relate it
                            connectOrCreate: {
                                where: {
                                    id: showId
                                },
                                create: {
                                    id: showId
                                }
                            }
                        }
                    }
                })
                // fetch new amount of likes
                let likes
                const likesResult = await database.show.findFirst({
                    where: {
                        id: showId
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
                    console.log('show has no likes')
                }
            } catch (e) {
                console.log(e)
                return fail(400, { error: 'saving show failed' })
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

    // Remove show from favourites
    unsaveShow: async ({ locals, params }) => {
        if (locals.user.id) {
            const showId = Number(params.showId)
            const userId = locals.user.id
            console.log('Unsave the show:')
            console.log('showId: ' + showId)
            console.log('User:    ' + userId)
            try {
                await database.show.update({
                    where: {
                        id: showId
                    },
                    data: {
                        favourited_by: {
                            disconnect: {
                                id: userId
                            }
                        }
                    }
                })
                // fetch new amount of likes
                let likes
                const likesResult = await database.show.findFirst({
                    where: {
                        id: showId
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
                    console.log('show has no likes')
                }
            } catch (e) {
                console.log(e);
                return fail(400, { error: 'unsaving the show failed' })
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

    // add show to liked shows of given user
    likeShow: async ({ locals, params }) => {
        console.log('LIKING SHOW')
        if (locals.user.id) {
            const showId = Number(params.showId)
            const userId = locals.user.id
            console.log(locals)
            let show = undefined
            let genres = undefined
            const response = await fetch(
                `https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.TMDB_API_KEY}`
            );
            console.log(response)
            if (response.ok) {
                show = await response.json()
                console.log(show)
                genres = await show.genres
            }
            console.log('showId:  ' + showId)
            console.log('User:  ' + userId)
            // link all the genres to the show
            const start = Date.now()
            for await (const genre of genres) {
                console.log('Genre: ' + genre.name)
                try {
                    await database.show.upsert({
                        where: {
                            id: showId
                        },
                        update: {
                            /* genres: {
                                connectOrCreate: {
                                    where: {
                                        id: genre.id
                                    },
                                    create: {
                                        id: genre.id,
                                        genre: genre.name
                                    }
                                }
                            }, */
                            likes: {
                                connect: {
                                    id: userId
                                }
                            }
                        },
                        create: {
                            id: showId,
                            /* genres: {
                                connectOrCreate: {
                                    where: {
                                        id: genre.id
                                    },
                                    create: {
                                        id: genre.id,
                                        genre: genre.name
                                    }
                                }
                            }, */
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

    // remove user from liked of given show
    unlikeShow: async ({ locals, params }) => {
        if (locals.user.id) {
            const showId = Number(params.showId)
            const userId = locals.user.id
            console.log('Show ID:  ' + showId)
            console.log('User:  ' + userId)
            try {
                await database.show.update({
                    where: {
                        id: showId
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
                return fail(400, { error: 'liking the show failed' })
            }
        } else {
            throw error(400, 'no user id found')
        }
    },

    writeComment: async ({ locals, params, request }) => {
        console.log('Writing comment')
        if (locals.user.id) {
            const form = await request.formData()
            const comment = form.get('comment')?.toString()
            if (!comment || comment.match(/^[!@#$%^&*()\[\]{};':"\\|,.<>\/?\s]*$/)) {
                console.log('missing comment')
                return fail(400, { error: 'missing comment' })
            } else {
                const showId = Number(params.showId)
                const userId = locals.user.id
                console.log('Show ID:  ' + showId)
                console.log('User:  ' + userId)
                console.log('Comment: ' + comment)
                try {
                    await database.showComments.create({
                        data: {
                            comment: comment,
                            user: {
                                connect: {
                                    id: userId
                                }
                            },
                            show: {
                                connectOrCreate: {
                                    where: {
                                        id: showId
                                    },
                                    create: {
                                        id: showId
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
