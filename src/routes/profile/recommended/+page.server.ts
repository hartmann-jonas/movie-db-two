import type { PageServerLoad } from './$types';
import { database } from '$lib/database';
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ params,locals }) => {
	const userId = locals.user.id
	let keywords: number[] = [];
	let keywordList: { id: any; occurrences: number; }[] = [];
	let recommededMovies = [];

    if (!locals.user) {
        throw redirect(302, '/')
    }

	const result = await database.user.findUnique({
		where: { id:userId },
		select: {
			liked_movies: {}
		}
	})

	if (!result) return recommededMovies

	let liked_movies = result.liked_movies
	
	// get all movie keywords from database
	const movies = await database.movie.findMany({
		where: {
			likes: {
				some: { id:userId }
			}
		},
		include: {
			keywords: true
		}
	})
	movies.forEach(movie => {
		movie.keywords.forEach(keyword => {
			keywords.push(keyword.id)
		});
	});
	keywords.forEach((keyword) => {
		let existing = keywordList.find((r) => r.id === keyword);
	  	if (existing) {
	    	existing.occurrences++;
	  	} else {
	    	keywordList.push({ id: keyword, occurrences: 1 });
	  	}
	});
	keywordList.sort((a, b) => b.occurrences - a.occurrences);
	let topKeywords = keywordList.slice(0, 5);
	let keywordString = topKeywords.map((t) => t.id).join(',');
	console.log(topKeywords)
	const response = await fetch(
		`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_keywords=${keywordString}`
	);
	if (response.ok) {
		const responseJson = await response.json()
		if (responseJson.total_results > 0) {
			recommededMovies = responseJson.results
			console.log(recommededMovies)
			// filter out all movies from the array that were liked by the user
			// to prevent recommending movies that the user already knows
			recommededMovies = recommededMovies.filter((movie: { id: number; }) => !liked_movies.find((f) => f.id === movie.id));
		}
	}
	return {
		props: {
			recommededMovies,
		},
	};
}