<script lang="ts">
	import { page } from '$app/stores'
    import type { PageServerData } from './$types';
    //Import the Card System component
    import MovieCard from '../../components/MovieCard.svelte';
    //Import fly animations
	import { fly } from 'svelte/transition';

    //Export the data about "Popular Movies"
    export let data: PageServerData;
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>

<h1>
    Hello, {$page.data.user.name}
</h1>

<p>Todays trending movies</p>
<section class="trending-movies">
    {#each data.props.trendingMovie as movie}
        <MovieCard {movie}/>
    {/each}
</section>

</section>

<style>
    .trending-movies {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	grid-column-gap: 1rem;
	grid-row-gap: 2rem;
	height: 20vh;
}
</style>