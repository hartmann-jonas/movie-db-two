<script lang="ts">
	import { page } from '$app/stores'
    import type { PageServerData } from './$types';
    //Import the Card System component
    import MovieCard from '../../components/MovieCard.svelte';
    //Import fly animations
	import { fly } from 'svelte/transition';

    //Export the data of "Saved Movies"
    export let data: PageServerData;
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>

<h1>
    Hello, {$page.data.user.name}
</h1>

<p>Your saved movies:</p>
{#if data.props.favouriteMovies.length > 0}
<section class="saved-movies">
    {#each data.props?.favouriteMovies as movie}
        <MovieCard {movie}/>
    {/each}
</section>
{:else}
<section class="no-saved-movies">
    <p>You have no saved movies.</p>
    <a href="/">Find some!</a>
</section>
{/if}

</section>

<style>
    .saved-movies {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	grid-column-gap: 1rem;
	grid-row-gap: 2rem;
	height: 20vh;
    max-height: 20vh;
    }

    .no-saved-movies {
        margin: auto;
        text-align: center;
        margin-top: 15vmin;
        font-size: 20px;
    }

    .no-saved-movies a {
        text-decoration: none;
        font-weight: 800;
        color: black;
    }
</style>