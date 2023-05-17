<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores'
	import MovieCard from '../../../components/MovieCard.svelte';
	import Icon from 'svelte-awesome';
	import bookmark from 'svelte-awesome/icons/bookmark';
	import bookmarkO from 'svelte-awesome/icons/bookmarkO';
	import heart from 'svelte-awesome/icons/heart';
	import heartO from 'svelte-awesome/icons/heartO';
	import { enhance } from '$app/forms';
	import Skeleton from 'svelte-skeleton-loader/';

	export let data: PageServerData;

	const countries = [
		{index: 1, name: "Sweden", code:"SE"},
		{index: 2, name: "Germany", code:"DE"},
		{index: 3, name: "Austria", code:"AT"},
		{index: 4, name: "Switzerland", code:"CH"},
		{index: 5, name: "Canada", code:"CA"},
		{index: 6, name: "USA", code:"US"},
		{index: 7, name: "Spain", code:"ES"},
	];

	$: likes = data.props.likes

	let selected = countries[0];
	
	function changeCountry() {
		console.log(`${selected?.code}`)
	}

	async function getLocation() {
		const resp = await fetch(`https://ipapi.co/json/`)
		const json = await resp.json()
		console.log(json.country_code, json.country_name, json.city)
		switch (json.country_code) {
			case 'SE':
				selected = countries[0]
				break
			case 'DE':
				selected = countries[1]
				break
			case 'AT':
				selected = countries[2]
				break
			case 'CH':
				selected = countries[3]
				break
			case 'CA':
				selected = countries[4]
				break
			case 'US':
				selected = countries[5]
				break
			case 'ES':
				selected = countries[6]
				break
		}
	}
	
	getLocation()

	$: details = data.props.movieAvailability.results[selected?.code]
	let limitedVideos = data.props.movieDetail.videos.results.slice(0, 5)
	let recommendedMovies = data.props.movieDetail.recommendations.results.slice(0, 10)
	const genres = data.props.movieDetail.genres
	const genresString = JSON.stringify(genres)

	function setLike() {
		data.props.liked = true
	}
	function unsetLike() {
		data.props.liked = false
	}
	// scale for icons
	let scale = 1.25;
</script>

<svelte:head>
	<title>{data.props.movieDetail.title} - Movie DB Two</title>
</svelte:head>

<section
	class="movie-details"
	in:fly={{ y: 50, duration: 500, delay: 500 }}
	out:fly={{ y: 50, duration: 400 }}
>
{#if data.props}
	<div class="img-container">
		{#if typeof data.props.movieDetail.backdrop_path == 'string'}
		<img
			src={'https://image.tmdb.org/t/p/original' + data.props.movieDetail.backdrop_path}
			alt={data.props.movieDetail.title}
			draggable="false"
		/>
		{/if}
	</div>
	<div id="movie-details" class="txt-container">
		<div class="title">
			<h1>{data.props.movieDetail.title}</h1>
			<div class="user-interactions">
				{#if likes==1}
					<p class="text-small">{likes} like</p>
				{:else}
					<p class="text-small">{likes} likes</p>
				{/if}
				{#if $page.data.user}
				<div class="interactions">
					{#if !data.props.liked}
					<form use:enhance class="unliked" action="?/likeMovie" method="post">
						<button type="submit"><Icon data={heartO} {scale}/></button>
						<input type="hidden" name="genres" value={genresString}>
					</form>
					{:else}
					<form use:enhance class="liked" action="?/unlikeMovie" method="post">
						<button type="submit"><Icon data={heart} {scale}/></button>
					</form>
					{/if}
					{#if !data.props.favorited}
					<form use:enhance class="unsaved" action="?/saveMovie" method="post">
						<button type="submit"><Icon data={bookmarkO} {scale}/></button>
					</form>
					{:else}
					<form use:enhance class="saved" action="?/unsaveMovie" method="post">
						<button type="submit"><Icon data={bookmark} {scale}/></button>
					</form>
					{/if}
				</div>
				{:else}
					<a class="interactions-alternative" href="/login">Login to like</a>
				{/if}
			</div>
		</div>
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
					{#if data.props.movieDetail.runtime > 0}
					{data.props.movieDetail.runtime}mins<br />
					{:else}
						unknown<br />
					{/if}
				</p>
			</div>
			{#if typeof data.props.movieDetail.production_companies[0] !== 'undefined'}
			<hr>
			<div class="production-infos">
				<h4 class="title-text">Production Infos</h4> <br />
				<span>Production Company:</span>
				{#if typeof data.props.movieDetail.production_companies[0].logo_path == 'string'}
				<br />
				<a href={'https://www.themoviedb.org/company/' +  data.props.movieDetail.production_companies[0].id}><img class="company-logo" src={'https://image.tmdb.org/t/p/original' + data.props.movieDetail.production_companies[0].logo_path} alt={data.props.movieDetail.production_companies[0].name} draggable="false"></a><br />
				{:else}
				{data.props.movieDetail.production_companies[0].name}<br />
				{/if}
				<span>Production Country:</span>
				{#if data.props.movieDetail.production_country}
				{data.props.movieDetail.production_countries[0].name}
				{:else}
					unknown
				{/if}
			</div>
			{/if}
		</div>
		<div id="movie-providers" class="providers">
			<div class="selText">
				<h4 class="title-text">Watch at:</h4>
				<form class="selCountry" on:change={changeCountry}>
					<label for="country">select country:</label>
					<select name="country" id="country" bind:value={selected}>
						{#each countries as country}
							<option value={country}>
								{country.name}
							</option>
						{/each}
					</select>
				</form>
			</div>
			{#if details}
				{#if details.flatrate}
				<p>Flatrate</p>
					{#each details.flatrate as test}
					<img class="provider-logo" src="https://image.tmdb.org/t/p/w500{test.logo_path}" alt="logo">
					{/each}
				{/if}
				{#if details.buy}
				<p>Buy</p>
					{#each details.buy as test}
					<img class="provider-logo" src="https://image.tmdb.org/t/p/w500{test.logo_path}" alt="logo">
					{/each}
				{/if}
				{#if details.rent}
				<p>Rent</p>
					{#each details.rent as test}
					<img class="provider-logo" src="https://image.tmdb.org/t/p/w500{test.logo_path}" alt="logo">
					{/each}
				{/if}
				{#if details.free}
				<p>Free</p>
					{#each details.free as test}
					<img class="provider-logo" src="https://image.tmdb.org/t/p/w500{test.logo_path}" alt="logo">
					{/each}
				{/if}
			{:else}
			<p>Not available in {selected.name}</p>
			{/if}
		</div>
		<hr />
		{#if recommendedMovies.length > 0}
		<div class="related-movies">
			<h4 class="title-text">Related Movies:</h4>
			<div class="movies">
				{#each recommendedMovies as movie}
				<div class="movie-cards m-3">
					<div class="movie-card">
						<a data-sveltekit-noscroll href={'/movie/' + movie.id} target="_self">
							{#if typeof movie.poster_path == 'string'}
							<img class="movie-card-image" src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} />
							{:else}
							<div class="no-img">
								<p class="no-img-available">no image available</p>
							</div>
							{/if}
						</a>
					</div>
				</div>
				{/each}
			</div>
		</div>
		{/if}
		{#if limitedVideos.length > 0}
		<div class="movie-videos">
			<h4 class="title-text">Related Videos:</h4>
			<div class="videos">
				{#each limitedVideos as video}
				<div class="video-card m-3">
					{#if video.site == "YouTube"}
					<iframe class="video-thumbnail" title={video.type} src="https://youtube.com/embed/{video.key}" frameborder="0"></iframe>
					{:else if video.site == "Vimeo"}
					<p>{video.type}</p>
					{/if}
					<div class="video-text">
						<p>{video.name}</p>
					</div>
				</div>
				{/each}
			</div>
		</div>
		{/if}
	</div>
{:else}
	<h1>Page Loading...</h1>
	<!-- <Skeleton class="img-container" />
	<Skeleton class="movie-details" /> -->
{/if}
</section>

<style>
	.img-container img{
		width: 100%;
		border-radius: .5rem;
	}

	.text-small {
		font-size: 1rem;
	}

	p {
		padding: 1rem 0rem;
	}

	hr {
		margin: 25px 0px 20px;
		color: var(--accents-2);
		border: .5px solid var(--accents-2);
	}

	.movie-txt {
		color: var(--accents-7)
	}

	.title {
		color: var(--foreground);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0rem 2rem;
	}

	.interactions-alternative {
		background-color: var(--background);
		color: var(--accents-6);
		text-decoration: none;
		padding: 5px;
		border-radius: .4rem;
		border: solid var(--accents-2) 1px;
	}

	.interactions-alternative:hover {
		color: var(--foreground);
	}

	.user-interactions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.user-interactions p {
		overflow: hidden;
		white-space: nowrap;
	}

	@media (max-width: 570px) {
		.user-interactions {
			flex-direction: column-reverse;
			gap: 1px;
		}

		.user-interactions p {
			padding: 0;
		}

		.text-small {
			font-size: .8rem;
		}

		.interactions-alternative {
			font-size: .9rem;
			overflow: hidden;
			white-space: nowrap;
		}
	}

	.interactions {
		display: flex;
	}

	.unliked button {
		display: flex;
		color: var(--foreground);
		background-color: var(--background);
		border: solid var(--accents-2) 1px;
		border-right: none;
		border-top-left-radius: 50%;
		border-bottom-left-radius: 50%;
		width: 40px;
		height: 40px;
		justify-content: center;
		align-items: center;
	}

	.liked button{
		display: flex;
		color: red;
		background-color: black;
		border: solid var(--accents-2) 1px;
		border-right: none;
		border-top-left-radius: 50%;
		border-bottom-left-radius: 50%;
		width: 40px;
		height: 40px;
		justify-content: center;
		align-items: center;
	}

	.unliked button:hover {
		transition: 0.25s;
		background-color: red;
		cursor: pointer;
	}

	.liked button:hover {
		transition: 0.25s;
		color: black;
		background-color: red;
		cursor: pointer;
	}

	.unsaved button {
		display: flex;
		color: white;
		background-color: black;
		border: solid var(--accents-2) 1px;
		border-left: none;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		width: 40px;
		height: 40px;
		justify-content: center;
		align-items: center;
	}

	.saved button {
		display: flex;
		color: gold;
		background-color: var(--background);
		border: solid 1px var(--accents-2);
		border-left: none;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		width: 40px;
		height: 40px;
		justify-content: center;
		align-items: center;
	}

	.unsaved button:hover {
		transition: 0.25s;
		background-color: goldenrod;
		cursor: pointer;
	}

	.saved button:hover {
		transition: 0.25s;
		color: black;
		background-color: goldenrod;
		cursor: pointer;
	}

	.movie-details {
		color: var(--accents-7);
		margin: 2rem auto;
		max-width: 80%;
	}

	@media (max-width: 400px) {
		.movie-details {
			margin: 1.5rem auto;
		}
	}

	span {
		font-weight: 600;
	}

	.company-logo {
		width: 20%;
		min-width: 20vh;
		margin-left: 2rem;
		padding: 1rem;
	}

	.providers {
		margin-top: 3rem;
	}

	.providers p {
		font-weight: bold;
	}

	.provider-logo {
		width: 50px;
		border-radius: 20%;
		margin: 5px;
		box-shadow: 0px 0px 5px var(--accents-1);
	}

	.selText {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	@media (max-width: 420px) {
		.selText {
			width: 100%;
			display: block;
			align-items: center;
			overflow: hidden;

		}
	}

	.selCountry {
		background-color: var(--background);
		border: solid var(--accents-2) 1px;
		border-radius: .5rem;
		padding: 5px;
		display: flex;
		gap: 15px;
	}

	select {
		border: none;
		font-size: inherit;
		color: inherit;
		background-color: inherit;
		font-weight: bold;
		text-align: right;
		-webkit-appearance: none;
	}

	.movie-videos {
		margin-top: 1rem;
		margin-bottom: 2.5rem;
	}

	.title-text {
    	font-size: 1.125rem;
    	line-height: 1.75rem;
		font-weight: 700;
	}

	.videos {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		-webkit-mask: linear-gradient(90deg, #0000, #000 10% 80%, #0000);
		-ms-overflow-style: -ms-autohiding-scrollbar; 
	}

	.video-card {
		margin: 0.75rem;
	}
	
	.video-thumbnail {
		width: 25rem;
		aspect-ratio: 16 / 9;
		border-top-left-radius: .5rem;
		border-top-right-radius: .5rem;
		border-bottom-left-radius: .5rem;
		border-bottom-right-radius: .5rem;
		box-shadow: 0px 0px 5px var(--accents-1);
	}

	.video-text {
		display: none;
	}

	@media (max-width: 420px) {
		.video-card {
			background-color: rgb(226, 226, 203);
			border-radius: .5rem;
			box-shadow: 0px 0px 5px darkgray;
		}
		
		.video-thumbnail {
			width: 15rem;
			border-bottom-left-radius: 0rem;
			border-bottom-right-radius: 0rem;
		}

		.video-text {
			display: contents;
			margin: .5rem;
		}

		.video-text p {
			overflow: hidden;
			max-height: 4rem;
			line-height: 1.5rem;
		}
	}
	.related-movies {
		margin-top: 2.5rem;
	}
	.movies {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		-webkit-mask: linear-gradient(90deg, #0000, #000 10% 80%, #0000);
		-ms-overflow-style: -ms-autohiding-scrollbar;
	}

	.movies::-webkit-scrollbar, .videos::-webkit-scrollbar {
		transform: translateZ(0);
		width: 12px;
	}

	.movies::-webkit-scrollbar-track, .videos::-webkit-scrollbar-track {
		border-radius: 10px;
  		padding: 2px 0;
  		background-color: var(--background);
		border: 1px solid var(--accents-2)
	}

	.movies::-webkit-scrollbar-thumb, .videos::-webkit-scrollbar-thumb {
  		border-radius: 10px;
		height: 2px;
		/* box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
		transform: translateZ(0);
  		background-color: var(--accents-1);
  		border: 1px solid var(--accents-2);
	}

	.movie-cards {
		min-width: 180px;
	}

	.movie-card {
		scroll-behavior: smooth;
		margin: 0.75rem;
	}

	.movie-card-image {
		object-fit: cover;
		border-radius: 1rem;
		margin-bottom: 1rem;
		display: block;
		width: 100%;
		max-width: 266.233px;
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
