<script lang="ts">
    import MovieGrid from '../../components/MovieGrid.svelte';
	import ShowGrid from '../../components/ShowGrid.svelte';
	import { page } from '$app/stores'
    import type { PageServerData } from './$types';
    //Import fly animations
	import { fly } from 'svelte/transition';

    //Export the data of "Saved Movies"
    export let data: PageServerData;
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>

<h1>
    Hi, {$page.data.user.name}!
</h1>

<p>Your saved movies:</p>
<!-- Nasty workaround to fix a bug where the user has an undefined saved movie -->
{#if data.props.favouriteMovies.length > 0 && data.props?.favouriteMovies[0] != undefined}
<section class="saved-movies">
    <MovieGrid movies={data.props?.favouriteMovies}/>
</section>
{:else}
<section class="no-saved-movies">
    <p>You have no saved movies.</p>
    <a href="/">Find some!</a>
</section>
{/if}
<hr>
<p>Your saved shows:</p>
{#if data.props.favouriteShows.length > 0 && data.props?.favouriteShows[0] != undefined}
<section class="saved-movies">
    <ShowGrid shows={data.props?.favouriteShows}/>
</section>
{:else}
<section class="no-saved-movies">
    <p>You have no saved shows.</p>
    <a href="/">Find some!</a>
</section>
{/if}

</section>


<style>
    .no-saved-movies {
        margin: auto;
        text-align: center;
        margin-top: 10vmin;
        margin-bottom: 10vmin;
        font-size: 20px;
    }

    .no-saved-movies a {
        text-decoration: none;
        font-weight: 800;
        color: var(--accents-8);
    }
    .no-saved-movies a:hover {
        color: var(--accents-6);
    }

    hr {
		margin: auto;
		margin-top: 2.5rem;
		margin-bottom: 2.5rem;
		border: 1px solid var(--accents-2);
		width: 95%;
	}
</style>