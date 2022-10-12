<!--<header>
	<a class="title" href="/" data-sveltekit-prefetch>Movie Database</a>
	<nav>
		<ul class="nav_links">
			<li><a href="/login">Login</a></li>
			<li><a href="https://themoviedb.org/">TMDB</a></li>
		</ul>
	</nav>
</header>
-->

<nav>
	<a class="title" href="/">Movie Database</a>
	<a class="login" href="/login">Login</a>
</nav>



<style>
/*
	li, a {
		font-family: 'Poppins';
		font-weight: bold;
		font-size: 1.3rem;
		color: black;
		text-decoration: none;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 15px;
		padding-left: 15px;
		min-height: 10vh;
	}

	.nav_links {
		list-style: none;
	}

	.nav_links li {
		display: inline-block;
		padding: 0px 15px;
	}
*/

	nav {
		display: flex;
		min-height: 10vh;
		align-items: center;
		justify-content: right;
	}

	.title {
		margin: auto;				/* Not a final solution, but better for visualisation */
	}

	a {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
		color: black;
		text-decoration: none;
	}
</style>
