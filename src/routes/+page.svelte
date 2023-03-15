<script>
	import MovieGrid from '../components/MovieGrid.svelte';
	import SearchMovies from '../components/SearchMovies.svelte';
	import { fly } from 'svelte/transition';
	export let data;
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>
	<SearchMovies />
	<h3>Popular Movies</h3>
	<MovieGrid movies={data.popular} />
</section>

<style>
	h3 {
		padding: 0 1rem;
	}
</style>