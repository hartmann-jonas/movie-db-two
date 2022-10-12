<nav data-sveltekit-prefetch>
	<a class="title" href="/">Movie Database</a>
	<a class="login" href="/login">Login</a>
</nav>



<style>
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
