<script lang="ts">
	import { page } from '$app/stores'
</script>


<nav data-sveltekit-prefetch>
	<!--HEADER VERSION LOGGED OUT-->
	{#if !$page.data.user}
		<a class="title" href="/">Movie Database</a>
		<a class="login" href="/login">Login</a>
	{/if}
	<!--HEADER VERSION LOGGED IN-->
	{#if $page.data.user}
		<a class="title" href="/">Movie Database</a>	
		<form action="/logout" method="POST">
			<button class="logout" type="submit">Logout</button>
		</form>
	{/if}
</nav>



<style>
	nav {
		display: flex;
		min-height: 10vh;
		align-items: center;
		justify-content: center;
	}
	/*Positioning of the right items in the navbar*/
	.login, .logout {
		position: absolute;
		right: 12%	;
	}

	button {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
		padding: 2.5px;
		background: red;
		border: none;
	}

	a {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
		color: black;
		text-decoration: none;
		padding: 5px;
	}
</style>
