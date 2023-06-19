<script>
	import { flip } from "svelte/animate";
	import ShowCard from "./ShowCard.svelte";
    export let shows;
</script>

<div class="movies-grid">
    {#each shows as show (show)}
		<div animate:flip>
			<ShowCard {show} />
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