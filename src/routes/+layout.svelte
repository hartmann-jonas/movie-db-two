<script>
	import '../global.css';
	import Nav from '../components/Nav.svelte';
	// Vercel analytics implementation
	import { dev } from '$app/environment';
  	import { inject } from '@vercel/analytics';

  	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Movie DB Two</title>
	<meta name="og:title" content="MovieDB"/>
	<meta name="description" content="Movie DB Two let's you find and save your favourite movies. You can find out where a movie is available and watch behind the scenes.">
</svelte:head>
<div class="content">
	<Nav />
	<slot />
</div>

<style>
	.content {
		width: 90vw;
		margin: auto;
	}
</style>