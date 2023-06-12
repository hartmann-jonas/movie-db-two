<script>
    export let show;
</script>

<div class="show-card">
	<a data-sveltekit-prefetch data-sveltekit-noscroll href={'/tv/' + show.id}>
		{#if typeof show.poster_path == 'string'}
		<img src={'https://image.tmdb.org/t/p/w500' + show.poster_path} alt={show.name} />
		{:else}
		<div class="no-img">
			<p class="no-img-available">no image available</p>
		</div>
		{/if}
	</a>
	<div class="description">
		<h2>{show.name}</h2>
		<p>{show.first_air_date}</p>
	</div>
</div>

<style>
	.show-card {
		scroll-behavior: smooth;
	}

	img {
		object-fit: cover;
		border-radius: 1rem;
		margin-bottom: 1rem;
		display: block;
		width: 100%;
		max-width: 266.233px;
	}

	h2 {
		font-size: 0.9rem;
	}

	.description {
		height: 5vh;
	}

	p {
		font-size: 0.7rem;
	}

	.show-card {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 1rem;
	}
	.no-img {
		display: flex;
		height: 30vh;
		text-align: center;
		align-items: center;
	}
	.no-img-available {
		font-weight: bold;
		font-size: 1.5rem;
		font-family: 'Poppins';
		color: var(--accents-7);
		text-decoration: none;
	}
</style>
