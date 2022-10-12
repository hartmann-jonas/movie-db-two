<script>
	import { fly } from 'svelte/transition';
	export let data;
</script>

<section
	class="movie-details"
	in:fly={{ y: 50, duration: 500, delay: 500 }}
	out:fly={{ y: 50, duration: 400 }}
>
	<div class="img-container">
		{#if typeof data.props.movieDetail.backdrop_path == 'string'}
		<img
			src={'https://image.tmdb.org/t/p/original' + data.props.movieDetail.backdrop_path}
			alt={data.props.movieDetail.title}
		/>
		{/if}
	</div>
	<div class="txt-container">
		<h1>{data.props.movieDetail.title}</h1>
		<p class="overview">{data.props.movieDetail.overview}</p>
		<div class="movie-txt">
			<div class="movie-facts">
				<p>
					<span>Release Date:</span>
					{#if typeof data.props.movieDetail.release_date !== 'undefined'}
						{data.props.movieDetail.release_date} <br />
					{:else}
						unknown<br />
					{/if}
					<span>Budget:</span>
					{#if data.props.movieDetail.budget > 0}
						${data.props.movieDetail.budget}<br />
					{:else}
						not public<br />
					{/if}
					<span>Rating:</span>
					{#if data.props.movieDetail.vote_average > 0}
						{data.props.movieDetail.vote_average}<br />
					{:else}
						unknown<br />
					{/if}
					<span>Runtime:</span>
					{#if typeof data.props.movieDetail.runtime > 0}
					{data.props.movieDetail.runtime}mins<br />
					{:else}
						unknown<br />
					{/if}
				</p>
			</div>
			{#if typeof data.props.movieDetail.production_companies[0] !== 'undefined'}
			<hr>
			<div class="production-infos">
				<h3>Production Infos</h3> <br />
				<span>Production Company:</span>
				{#if typeof data.props.movieDetail.production_companies[0].logo_path == 'string'}
				<br />
				<a href={'https://www.themoviedb.org/company/' +  data.props.movieDetail.production_companies[0].id}><img class="company-logo" src={'https://image.tmdb.org/t/p/original' + data.props.movieDetail.production_companies[0].logo_path} alt={data.props.movieDetail.production_companies[0].name}></a><br />
				{:else}
				{data.props.movieDetail.production_companies[0].name}<br />
				{/if}
				<span>Production Country:</span>
				{data.props.movieDetail.production_countries[0].name}
			</div>
			{/if}
		</div>
		<div class="providers">
			<h1>Watch at:</h1>
		</div>
	</div>
</section>

<style>
	h1 {
		padding: 1rem 0rem 2rem;
	}

	p {
		padding: 1rem 0rem;
	}

	.img-container {
		width: 100%;
	}

	img {
		width: 100%;
		border-radius: 1rem;
	}

	.movie-details {
		margin: 2rem 20%;
	}

	span {
		font-weight: bold;
	}
	.company-logo {
		width: 20%;
		margin-left: 30px;
		padding: 15px;
	}
	.production-infos {
		padding-top: 20px;
	}
</style>
