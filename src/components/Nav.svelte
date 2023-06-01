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
	<div class="profile">
		<a class="profile" href="/profile">Profile</a>
		<a class="profile" href="/profile/recommended">Recommended</a>
	</div>
	<a id="title" class="title" href="/">Movie Database</a>	
	<div class="logout">
		<form action="/logout" method="POST">
			<button type="submit">Logout</button>
		</form>
	</div>
</nav>
{/if}


<style>
	.profile {
		text-align: left;
		width: 25%;
		color: var(--accents-5);
		transition: all 100ms ease;
	}

	.profile:hover {
		color: var(--foreground);
	}

	.title {
		text-align: center;
		width: 50%;
		color: var(--foreground)
	}

	.logout {
		width: 25%;
		text-align: right;
	}

	.nav {
		position: sticky;
		top: 0;
		padding: 15px;
		display: flex;
		min-height: 10vh;
		align-items: center;
		background-color: var(--background-transparent);
		backdrop-filter: blur(15px);
		-webkit-backdrop-filter: blur(15px);
		border-bottom: 1.5px var(--accents-2) solid;
		z-index: 1000;
	}
	
	#unlogged {
		justify-content: center;
	}

	#logged {
		justify-content: space-between;
		padding-left: 6vw;
		padding-right: 6vw;
	}

	/*Positioning of the right items in the navbar*/
	.login {
		position: absolute;
		right: 6%;
		color: var(--accents-5);
		transition: all 100ms ease;
	}

	.login:hover {
		color: var(--foreground)
	}

	button {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
		padding: 2.5px;
		background: none;
		border: none;
		color: var(--accents-5);
		transition: all 100ms ease;
	}

	button:hover {
		color: var(--foreground)
	}

	a {
		font-size: 1rem;
		font-weight: bold;
		font-family: 'Poppins';
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
