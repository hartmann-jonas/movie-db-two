import 'dotenv/config'

export async function load({ params }) {
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${params.id}&page=1&include_adult=false`
	);
	const data = await response.json();
	if (response.ok) {
		return {
			props: {
				searchedMovie: data.results,
			},
		};
	}
}