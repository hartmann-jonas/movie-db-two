<script>
	import MovieGrid from '../components/MovieGrid.svelte';
	import SearchMovies from '../components/SearchMovies.svelte';
	import ShowGrid from '../components/ShowGrid.svelte';
	import { fly } from 'svelte/transition';
	export let data;

	console.log(data.popularShows)
</script>

<section in:fly|global={{ y: -40, duration: 500, delay: 500 }} out:fly|global={{ y: -40, duration: 500 }}>
	<SearchMovies />
	<h3>Trending Movies</h3>
	<MovieGrid movies={data.popularMovies} />
	<hr>
	<h3>Trending TV Shows</h3>
	<ShowGrid shows={data.popularShows} />
</section>

<style>
	* {
		color: var(--foreground)
	}

	h3 {
		padding: 0 1rem;
	}

	hr {
		margin: auto;
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
		border: 1px solid var(--accents-2);
		width: 95%;
	}
</style>