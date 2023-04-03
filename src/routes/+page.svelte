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
<footer>
    <p>Go to the <a href="https://hartmann-jonas.github.io/blog" target="_blank">Development blog</a></p>
</footer>

<style>
	h3 {
		padding: 0 1rem;
	}

	footer {
		width: 100%;
		text-align: center;
		height: 80px;
		padding: 10px;
	}

	a {
		text-decoration: none;
		color: black;
		font-weight: 700;
		transition: all 10ms ease-in-out;
	}

	a:hover {
		color: #2d3236;
	}
</style>