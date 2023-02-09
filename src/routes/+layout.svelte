<script>
	import '../global.css';
	import Nav from '../components/Nav.svelte';

	import { dev } from '$app/environment';
  	import { inject } from '@vercel/analytics';

  	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Movie DB</title>
</svelte:head>

<Nav />
<slot />