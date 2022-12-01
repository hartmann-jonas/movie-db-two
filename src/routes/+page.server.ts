import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import 'dotenv/config'

export const load: PageServerLoad = async ({}) => {

	const fetchMovies = async () => {
		const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`);
		const data = await res.json()
        if (res.ok) {
            return data.results
	    }
        throw error(404,"not found")
    }
    return {
        popular: fetchMovies(),
    }
}