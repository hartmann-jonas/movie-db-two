<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Icon from 'svelte-awesome';
	import spinner from 'svelte-awesome/icons/spinner';
	import { fly } from 'svelte/transition';
	import { Turnstile } from 'svelte-turnstile';

	export let form: ActionData;

	let signin = false;
	let scale = 3;
</script>

<svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>
	<div class="signin">
		<div class="head">
			<h4>Sign In</h4>
		</div>
		{#if signin}
			<div class="loading">
				<h4>Signing in</h4>
				<br />
				<Icon data={spinner} pulse {scale} />
			</div>
		{:else}
			<form method="POST" use:enhance={({})=>{
				signin = true
				return async ({result, update}) => {
				  if(result.type!="redirect") {
					signin = false
				  }
				  update()
				}
				}}>
				<div class="fields">
					<div>
						<label for="username">USERNAME</label>
						<input id="username" name="username" type="text" required />
					</div>
					<div>
						<label for="password">PASSWORD</label>
						<input id="password" name="password" type="password" required />
					</div>
					<div class="turnstile">
						<div class="cf-turnstile" data-sitekey="0x4AAAAAAAEggr1Gpnt5Fmzp" data-theme="light"></div>
<!-- 						<Turnstile siteKey="0x4AAAAAAAEggr1Gpnt5Fmzp" theme="light" />
 -->				</div>

					{#if form?.invalid}
						<p class="error">Username and password required.</p>
					{/if}
					{#if form?.credentials}
						<p class="error">Wrong credentials.</p>
					{/if}
					{#if form?.captcha}
						<p class="error">Captcha failed: {form?.error}</p>
					{/if}
					<button type="submit" value="Submit">Sign In</button>
					<div class="text">
						<p>
							Don't have an account? <a href="/register">Sign up</a> instead.
						</p>
					</div>
				</div>
			</form>
		{/if}
	</div>
</section>

<style>
	:root {
		--big-font: 1rem;
		--medium-font: 0.875rem;
		--small-font: 0.75rem;
	}

	.signin {
		margin-top: 15vh;
		margin-left: auto;
		margin-right: auto;
		line-height: inherit;
		box-shadow: 0 0 5px darkgray;
		background-color: rgb(226, 226, 203);
		border: 1px;
		border-radius: 1rem;
		max-width: 28rem;
		width: 100%;
	}

	.head {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		text-align: center;
		border-radius: 1rem 1rem 0 0;
		padding-left: 4rem;
		padding-right: 4rem;
		padding-top: 2rem;
		padding-bottom: 1.5rem;
	}

	.loading {
		padding: 5rem;
		text-align: center;
		align-items: center;
		border-radius: 0 0 1rem 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		padding-left: 4rem;
		padding-right: 4rem;
		padding-top: 2rem;
		padding-bottom: 2rem;
	}

	label {
		text-transform: uppercase;
		padding-top: 0.5rem;
		font-size: var(--small-font);
		line-height: 1rem;
		display: block;
	}

	input {
		font-size: var(--big-font);
		line-height: 1.25rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 0.75rem;
		padding-bottom: 0.75rem;
		border-color: rgb(209, 213, 219);
		border-width: 1px;
		border-radius: 0.375rem;
		width: 100%;
		display: block;
		margin-top: 0.25rem;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
		color: white;
		font-size: var(--big-font);
		line-height: 1.25rem;
		background-color: black;
		border-color: black;
		border-width: 1px;
		border-radius: 0.375rem;
		cursor: pointer;
		width: 100%;
		height: 2.5rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	button:hover {
		color: black;
		background-color: rgb(250, 250, 237);
	}

	.text {
		margin-top: 1rem;
		margin-bottom: 1rem;
		font-size: var(--medium-font);
		line-height: 1.25rem;
		text-align: center;
	}

	.text a {
		color: black;
		text-decoration: inherit;
		font-weight: 600;
		text-align: center;
	}

	.error {
		padding-top: 1rem;
		font-size: var(--medium-font);
		line-height: 1.25rem;
		color: red;
		text-align: center;
	}

	.turnstile {
		margin-top: 1rem;
		text-align: center;
	}
</style>
