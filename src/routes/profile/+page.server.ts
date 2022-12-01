import type { PageServerLoad } from './$types';
import { redirect } from "@sveltejs/kit"
import 'dotenv/config'

export const load: PageServerLoad = async ({ locals }) => {	
    if (!locals.user) {
        throw redirect(302, '/')
    }

    const response = await fetch(
		`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}`
	);
	const data = await response.json();
	if (response.ok) {
		return {
			props: {
				trendingMovie: data.results,
			},
		};
	}
}