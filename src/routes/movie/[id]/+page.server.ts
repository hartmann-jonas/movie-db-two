import type { PageServerLoad } from './$types';
import type { Action, Actions } from './$types';
import { database } from '$lib/database';
import { error } from '@sveltejs/kit'

import 'dotenv/config'

export const load: PageServerLoad = async ({params}) => {	
	//Fetch the details for the movie by ID
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
	);
	const movieDetail = await response.json();
	if (response.ok) {
		//If we can fetch the details, then fetch where it it available to stream
		const resAvailability = await fetch(
			`https://api.themoviedb.org/3/movie/${params.id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
		);
		const movieAvailability = await resAvailability.json();
		if (resAvailability.ok) {
			return {
				props: {
					movieDetail,
					movieAvailability
				},
			};
		};	
	}
	throw error(404,"not found")
}

//Store ${params.id} to database.favourites


const saveMovie: Action = async ({ params, locals }) => {
	let movieId = +params.id
	console.log('Movie ID:'+ movieId)
	console.log('User:' + locals.user.id)

	

	await database.favourite.create({
		data: {
			movieId: movieId,
			userId:  locals.user.id
		}
	})
}

export const actions: Actions = { saveMovie }