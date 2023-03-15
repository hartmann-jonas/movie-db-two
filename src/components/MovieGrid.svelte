<script>
	import { flip } from "svelte/animate";
    import MovieCard from "./MovieCard.svelte";
    export let movies;
</script>

<div class="movies-grid">
    {#each movies as movie (movie)}
		<div animate:flip>
			<MovieCard {movie} />
		</div>
    {/each}
</div>

<style>
	.movies-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		grid-column-gap: 1rem;
		grid-row-gap: 2rem;
		margin: auto;
	}
	@media (max-width: 575px) {
		.movies-grid {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		}
	}
</style>