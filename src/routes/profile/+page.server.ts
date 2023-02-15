import type { PageServerLoad } from './$types';
import { redirect } from "@sveltejs/kit"
import { database } from '$lib/database';
import 'dotenv/config'

export const load: PageServerLoad = async ({ params,locals }) => {
	const userId = locals.user.id
    if (!locals.user) {
        throw redirect(302, '/')
    }

	const result = await database.user.findUnique({
		// Go to currently logged in user
		where:{
			id:userId
		},
		select:{
			// get all favourited movies
			favorite_movies:{
			}
		}
	})

	let favourited_movies = result?.favorite_movies
	
	// simultaneous fetch of all movies details
	let favouriteMovies:Promise<any>[] = [];
	if (favourited_movies) {
		for (const movie of favourited_movies) {
			const foo = async () => {
			const response = await fetch(
				`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
			);
			if (response.ok) {
				const data = await response.json()
				return data
			} else {
				console.log("Response not ok")
			}};
			favouriteMovies.push(foo())
		}
		return {
			props: {
				favouriteMovies: await Promise.all(favouriteMovies),
			},
		};
	}
}