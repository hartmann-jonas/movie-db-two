<script>
	import PopularMovies from '../components/PopularMovies.svelte';
	import SearchMovies from '../components/SearchMovies.svelte';
	import { fly } from 'svelte/transition';
	export let data;
	const {popular} = data;
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>
	<SearchMovies />
	<PopularMovies movies={popular} />
</section>