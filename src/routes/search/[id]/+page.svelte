<script lang="ts">
	//Import fly animation from svelte
	import { fly } from 'svelte/transition';
	//Import the redirect from svelte
	import { goto } from '$app/navigation';
	//Import the Card System component
	import MovieCard from '../../../components/MovieCard.svelte';
	//Import the data for the searched Movies
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>
<section in:fly|global={{ y: -40, duration: 500, delay: 500 }} out:fly|global={{ y: -40, duration: 500 }}>
<div class="title">
	<h3>Results for your search</h3>
	<a href="/">Back</a>
</div>
	
{#if data.props}
	<div class="searched-movies">
		<!--Loop over the movies and render the card-->
		{#each data.props.searchedMovie as movie}
		<MovieCard {movie} />
		{/each}
	</div>
{/if}
</section>
	
<style>
	.title {
		display: flex;
		justify-content: space-between;
		color: var(--foreground);
		font-size: 1.1rem;
		font-weight: bold;
	}

	.title a, .title a::after {
		text-decoration: none;
		color: var(--foreground);
	}

	.searched-movies {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		grid-column-gap: 1rem;
		grid-row-gap: 2rem;
		height: 20vh;
	}
</style>