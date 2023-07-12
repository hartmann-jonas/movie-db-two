<script lang="ts">
	import { fly } from 'svelte/transition';
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types'
  export let form: ActionData
  import Icon from 'svelte-awesome';
  import spinner from 'svelte-awesome/icons/spinner';

  let register = false
  let scale = 3;
</script>

<section in:fly|global={{ y: -40, duration: 500, delay: 500 }} out:fly|global={{ y: -40, duration: 500 }}>
  <div class="register">
    <div class="head">
      <h4>Sign Up</h4>
    </div>
    {#if register}
      <div class="loading">
        <h4>Signing up</h4>
        <br>
        <Icon data={spinner} pulse {scale} />
      </div>
    {:else}
      <form use:enhance={({})=>{
        register = true
        return async ({result, update}) => {
          if(result.type!="redirect") {
            register = false
          }
          update()
        }
        }} action="?/register" method="POST">
        <div class="fields">
          <div>
          <label for="username">USERNAME</label>
            <input id="username" name="username" type="text" required />
          </div>
          <div>
            <label for="password">PASSWORD</label>
            <input id="password" name="password" type="password" required />
          </div>

          {#if form?.user}
          <p class="error">Username already taken.</p>
          {/if}
          <button type="submit">Sign In</button>
          <div class="text">
            <p>
              You have an account? <a href="/login">Sign in</a> instead.
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

	.register {
		margin-top: 10vh;
		margin-left: auto;
		margin-right: auto;
		line-height: inherit;
		background-color: var(--background);
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
		margin-top: 0.25rem;
		font-size: var(--big-font);
		line-height: 1.25rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 0.75rem;
		padding-bottom: 0.75rem;
		outline: none;
		border: none;
		color: var(--text-color-1);
		border: solid var(--accents-2);
		border-width: 1px;
		background: var(--system-grey);
		width: 100%;
		display: block;
		border-radius: 0.375rem;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
		color: var(--accents-7);
		font-size: var(--big-font);
		line-height: 1.25rem;
		background-color: var(--accents-2);
		border-color: transparent;
		border-width: 1px;
		border-radius: 0.375rem;
		cursor: pointer;
		width: 100%;
		height: 2.5rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	button:hover {
		color: var(--background);
		background-color: var(--accents-7);
	}

	.text {
		margin-top: 1rem;
		margin-bottom: 1rem;
		font-size: var(--medium-font);
		line-height: 1.25rem;
		text-align: center;
	}

	.text a {
		color: var(--text-color-1);
		text-decoration: inherit;
		font-weight: 600;
		text-align: center;
	}

	.error {
		padding-top: 1rem;
		font-size: var(--medium-font);
		line-height: 1.25rem;
		color: var(--error-red);
		text-align: center;
	}
</style>
