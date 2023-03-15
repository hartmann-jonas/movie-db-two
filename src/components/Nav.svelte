<script lang="ts">
	import { page } from '$app/stores'
</script>

{#if !$page.data.user}

<nav id="unlogged" class="nav" data-sveltekit-prefetch>
	<!--HEADER VERSION LOGGED OUT-->
		<a class="title" href="/">Movie Database</a>
		<a class="login" href="/login">Login</a>
</nav>
{/if}
{#if $page.data.user}
<nav id="logged" class="nav" data-sveltekit-prefetch>
	<!--HEADER VERSION LOGGED IN-->
		<a class="profile" href="/profile">Profile</a>
		<a id="title" class="title" href="/">Movie Database</a>	
		<form action="/logout" method="POST">
			<button class="logout" type="submit">Logout</button>
		</form>
</nav>
{/if}


<style>
	.nav {
		width: 100%;
		display: flex;
		min-height: 10vh;
		align-items: center;
	}
	
	#unlogged {
		justify-content: center;
	}

	#logged {
		justify-content: space-between;
	}

	/*Positioning of the right items in the navbar*/
	.login {
		position: absolute;
		right: 6%;
	}

	button {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
		padding: 2.5px;
		background: none;
		border: none;
		color: black;
	}

	a {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
		color: black;
		text-decoration: none;
		padding: 5px;
	}

	@media (max-width: 400px) {
		.nav {
			display: flex;
			justify-content: space-between;
		}

		a, button {
			font-size: 0.85rem;
		}
	}
</style>
