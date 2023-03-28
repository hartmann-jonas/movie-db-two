import type { PageServerLoad } from './$types';
import { database } from '$lib/database';
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user.id
	let genres: number[] = [];
	let genresList: { id: any; occurrences: number; }[] = [];
	let recommendedMovies = [];

    if (!locals.user) {
        throw redirect(302, '/')
    }

	const result = await database.user.findUnique({
		where: { id:userId },
		select: {
			liked_movies: {}
		}
	})

	if (!result) return recommendedMovies

	let liked_movies = result.liked_movies
	
	// get all movie genres from database
	const movies = await database.movie.findMany({
		where: {
			likes: {
				some: { id:userId }
			}
		},
		include: {
			genres: true
		}
	})
	movies.forEach(movie => {
		movie.genres.forEach(genre => {
			genres.push(genre.id)
		});
	});
	genres.forEach((genre) => {
		let existing = genresList.find((r) => r.id === genre);
	  	if (existing) {
	    	existing.occurrences++;
	  	} else {
	    	genresList.push({ id: genre, occurrences: 1 });
	  	}
	});
	genresList.sort((a, b) => b.occurrences - a.occurrences);
	let topGenres = genresList.slice(0, 3);
	let genreString = topGenres.map((t) => t.id).join(',');
	console.log(topGenres)
	const response = await fetch(
		`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_runtime.gte=75&with_genres=${genreString}`
	);
	if (response.ok) {
		const responseJson = await response.json()
		if (responseJson.total_results > 0) {
			recommendedMovies = responseJson.results
			// filter out all movies from the array that were liked by the user
			// to prevent recommending movies that the user already knows
			recommendedMovies = recommendedMovies.filter((movie: { id: number; }) => !liked_movies.find((f) => f.id === movie.id));
			// only include movies with more than 100 votes in order to filter out unrelevant movies
			recommendedMovies = recommendedMovies.filter((movie: {vote_count: number; }) => movie.vote_count > 500)
			console.log(recommendedMovies)
		}
	}
	return {
		props: {
			recommendedMovies,
		},
	};
}