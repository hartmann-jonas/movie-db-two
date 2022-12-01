<script lang="ts">
	import { page } from '$app/stores'
</script>

{#if !$page.data.user}

<nav class="unlogged-nav" data-sveltekit-prefetch>
	<!--HEADER VERSION LOGGED OUT-->
		<a class="title" href="/">Movie Database</a>
		<a class="login" href="/login">Login</a>
</nav>
{/if}
{#if $page.data.user}
<nav class="logged-nav" data-sveltekit-prefetch>
	<!--HEADER VERSION LOGGED IN-->
		<a class="profile" href="/profile">Profile</a>
		<a class="title" href="/">Movie Database</a>	
		<form action="/logout" method="POST">
			<button class="logout" type="submit">Logout</button>
		</form>
</nav>
{/if}


<style>
	.unlogged-nav {
		display: flex;
		min-height: 10vh;
		align-items: center;
		justify-content: center;
	}

	.logged-nav {
		display: flex;
		min-height: 10vh;
		align-items: center;
		justify-content: space-between;
	}

	/*Positioning of the right items in the navbar*/
	.login {
		position: absolute;
		right: 10%	;
	}

	button {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
		padding: 2.5px;
		background: none;
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
