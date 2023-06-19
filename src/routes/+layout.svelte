<script>
	import '../global.css';
	import Nav from '../components/Nav.svelte';
	// Vercel analytics implementation
	import { dev } from '$app/environment';
  	import { inject } from '@vercel/analytics';
	import { Icon } from 'svelte-awesome';
	import githubSquare from 'svelte-awesome/icons/githubSquare'

  	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Movie DB Two</title>
	<meta name="og:title" content="MovieDB"/>
	<meta name="description" content="Movie DB Two let's you find and save your favourite movies. You can find out where a movie is available and watch behind the scenes.">
	<meta name="theme-color" content="#000">
</svelte:head>
<div class="content">
	<Nav />
	<div class="slot">
		<slot />
	</div>
	<footer>
		<div class="footer-left">
			<p>Made possible by TheMovieDB API and JustWatch</p>
		</div>
		<div class="footer-center">
			<p>Go to the <a href="https://project-page-hartmann-jonas.vercel.app/blog" target="_blank">Development blog</a></p>
			<a href="https://vercel.com" target="_blank"><img class="powered-by-vercel" src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg" alt="powered by vercel"></a>
		</div>
		<div class="footer-right">
			<div class="icons">
				<a href="https://github.com/hartmann-jonas/movie-db-two.git">
					<Icon data={githubSquare} style="color: var(--foreground)" scale=2.5/>
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	:root {
		--theme-color: #000;
		--theme-color: #fff;

		/* COLOR PALETTE 1 */
		--color-1-1: #0D1B2A;
		--color-1-2: #1B263B;
		--color-1-3: #415A77;
		--color-1-4: #778DA9;
		--color-1-5: #E0E1DD;

		/* VERCEL WEBSITE COLORSCHEME */
		--foreground: #fff;
		--background: #000;
		--background-transparent: #000000d0;
		--accents-1: #111;
		--accents-2: #333;
		--accents-3: #444;
		--accents-4: #666;
		--accents-5: #888;
		--accents-6: #999;
		--accents-7: #eaeaea;
		--accents-8: #fafafa;

		/* GENERAL COLORS */
		--error-red: rgb(180, 0, 0);
	}

	@media (prefers-color-scheme: light) {
		:root {
			--foreground: #000;
			--background: #fff;
			--background-transparent: #ffffffd0;
			--accents-1: #eee;
			--accents-2: #ddd;
			--accents-3: #ccc;
			--accents-4: #bbb;
			--accents-5: #aaa;
			--accents-6: #999;
			--accents-7: #2e2e2e;
			--accents-8: #0a0a0a;
		}
	}
	.content {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100vw;
		margin: auto;
	}

	.slot {
		color: var(--accents-7);
		flex: 1;
		margin-top: 15px;
		margin-bottom: 25px;
		margin-left: 40px;
		margin-right: 40px;
	}

	footer {
		flex-shrink: 0;
		height: 9rem;
		width: 100%;
		text-align: center;
		padding: 10px;
		background-color: var(--background);
		border-top: solid var(--accents-2) 1.5px;
		padding-top: 2rem;
		padding-bottom: 2rem;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		font-size: .9rem;
	}

	.footer-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: left;
		margin-left: 15px;
		height: 5rem;
	}

	.footer-left, .footer-center, .footer-right {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: left;
		margin-left: 15px;
		height: 5rem;
	}

	p {
		color: var(--foreground)
	}

	a {
		text-decoration: none;
		color: var(--accents-7);
		font-weight: 700;
		transition: all 10ms ease-in-out;
	}

	a:hover {
		color: var(--accents-6);
	}

	.powered-by-vercel {
		height: 40px;
		margin: 15px;
	}
</style>