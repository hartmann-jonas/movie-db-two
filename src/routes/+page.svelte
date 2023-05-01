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
    <p>Go to the <a href="https://project-page-hartmann-jonas.vercel.app/blog" target="_blank">Development blog</a></p>
	<a href="https://vercel.com" target="_blank"><img class="powered-by-vercel" src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg" alt="powered by vercel"></a>
</footer>

<style>
	h3 {
		padding: 0 1rem;
	}

	footer {
		width: 100%;
		text-align: center;
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

	.powered-by-vercel {
		height: 40px;
		margin: 15px;
	}
</style>