<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores'
	import Icon from 'svelte-awesome';
  	import check from 'svelte-awesome/icons/check';

	export let data: PageServerData;

	const countries = [
		{index: 1, name: "Germany", code:"DE"},
		{index: 2, name: "Sweden", code:"SE"},
		{index: 3, name: "Austria", code:"AT"},
		{index: 4, name: "Switzerland", code:"CH"},
		{index: 5, name: "Canada", code:"CA"},
		{index: 6, name: "USA", code:"US"}
	];

	let selected:any = countries[0];
	
	function changeCountry() {
		console.log(`${selected?.code}`)
	}

	$: details = data.props.movieAvailability.results[selected?.code]

	// scale for icons
	let scale = 1.5;

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
		<div class="title">
			<h1>{data.props.movieDetail.title}</h1>
			{#if $page.data.user}
				{#if !data.props.favorited}
					<form action="?/saveMovie" method="post">
						<button type="submit">save</button>
					</form>
				{:else}
					<div class="saved">
						<Icon data={check} {scale}/>
					</div>
				{/if}
			{/if}
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
			<div class="title">
				<h3>Watch at:</h3>
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
			{/if}
			{#if !details}
				<p>Not available in {selected.name}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	p {
		padding: 1rem 0rem;
	}

	hr {
		margin: 25px 0px 20px;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 0rem 2rem;
	}

	.title button {
		color: white;
		background-color: black;
		border: none;
		border-radius: 100%;
		width: 40px;
		height: 40px;
	}

	.saved {
		display: flex;
		border-radius: 100%;
		width: 40px;
		height: 40px;
		background-color: goldenrod;
		justify-content: center;
		align-items: center;
	}

	.title button:hover {
		transition: 0.25s;
		background-color: goldenrod;
		cursor: pointer;
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
		min-width: 20%;
		margin-left: 30px;
		padding: 15px;
	}

	.providers p {
		font-weight: bold;
	}

	.provider-logo {
		width: 50px;
		border-radius: 20%;
		margin: 5px;
		box-shadow: 0px 0px 5px darkgray;
	}
</style>
