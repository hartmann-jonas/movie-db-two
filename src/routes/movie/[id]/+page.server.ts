import 'dotenv/config'

export async function load({ params }) {
	const response = await fetch(
		`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
	);
	const movieDetail = await response.json();
	if (response.ok) {
		return {
			props: { movieDetail }
		};
	}
}