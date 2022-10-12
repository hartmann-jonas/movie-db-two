<script>
    export let movie;
</script>

<div class="movie-card">
	<a data-sveltekit-prefetch data-sveltekit-noscroll href={'/movie/' + movie.id}>
		{#if typeof movie.poster_path == 'string'}
		<img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} />
		{:else}
		<div class="no-img">
			<p class="no-img-available">no image available</p>
		</div>
		{/if}
	</a>
	<div class="description">
		<h2>{movie.title}</h2>
		<p>{movie.release_date}</p>
	</div>
</div>

<style>
	.movie-card {
		scroll-behavior: smooth;
	}

	img {
		object-fit: cover;
		border-radius: 1rem;
		margin-bottom: 1rem;
		display: block;
  		max-width:100%;
  		max-height:100%;
  		width: auto;
  		height: auto;
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

	.movie-card {
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
		color: black;
		text-decoration: none;
	}
</style>
