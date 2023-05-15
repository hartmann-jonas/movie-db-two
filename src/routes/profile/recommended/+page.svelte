<script lang="ts">
    import MovieGrid from '../../../components/MovieGrid.svelte';
	import { page } from '$app/stores'
    import type { PageServerData } from './$types';
    //Import fly animations
	import { fly } from 'svelte/transition';

    //Export the data of "Saved Movies"
    export let data: PageServerData;
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>

<h3>Movies recommended for {$page.data.user.name}!</h3>

{#if data.props.recommendedMovies}
<section class="recommended-movies">
    <MovieGrid movies={data.props.recommendedMovies}/>
</section>
{:else}
<section class="no-recommended-movies">
    <p>We don't know enough about you.</p>
    <a href="/">Like some more movies to get recommendations!</a>
</section>
{/if}

</section>

<style>
    .no-recommended-movies {
        margin: auto;
        text-align: center;
        margin-top: 15vmin;
        font-size: 20px;
    }

    .no-recommended-movies a {
        text-decoration: none;
        font-weight: 800;
        color: var(--foreground);
    }
</style>