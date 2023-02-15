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

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>
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
  .register {
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
    padding-top: .5rem;
    font-size: .75rem;
    line-height: 1rem;
    display: block;
  }

  input {
    font-size: .875rem;
    line-height: 1.25rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: .75rem;
    padding-bottom: .75rem;
    border-color: rgb(209, 213, 219);
    border-width: 1px;
    border-radius: .375rem;
    width: 100%;
    display: block;
    margin-top: .25rem;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    transition-property: all;
    transition-timing-function: cubic-bezier(.4, 0, .2 , 1);
    transition-duration: .15s;
    color: white;
    font-size: .875rem;
    line-height: 1.25rem;
    background-color: black;
    border-color: black;
    border-width: 1px;
    border-radius: .375rem;
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
    font-size: .875rem;
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
    font-size: .875rem;
    line-height: 1.25rem;
    color: red;
    text-align: center;
  }
</style>