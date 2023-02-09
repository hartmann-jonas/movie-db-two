<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  export let form: ActionData
  import Icon from 'svelte-awesome';
  import spinner from 'svelte-awesome/icons/spinner';
	import { fly } from 'svelte/transition';

  let signin = false
  let scale = 3;
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>
  <div class="signin">
    <div class="head">
      <h4>Sign In</h4>
    </div>
    {#if signin}
      <div class="loading">
        <h4>Signing in</h4>
        <br>
        <Icon data={spinner} pulse {scale} />
      </div>
    {:else}
      <form use:enhance={({})=>{
        signin = true
        return async ({result, update}) => {
          if(result.type!="redirect") {
            signin = false
          }
          update()
        }
        }} action="?/login" method="POST">
        <div class="fields">
          <div>
          <label for="username">USERNAME</label>
            <input id="username" name="username" type="text" required />
          </div>
          <div>
            <label for="password">PASSWORD</label>
            <input id="password" name="password" type="password" required />
          </div>

          {#if form?.invalid}
          <p class="error">Username and password required.</p>
          {/if}
          {#if form?.credentials}
          <p class="error">Wrong credentials.</p>
          {/if}
          <button type="submit">Sign In</button>
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
  .signin {
    margin-top: 15vh;
    margin-left: auto;
    margin-right: auto;
    line-height: inherit;
    box-shadow: 0 0 5px darkgray;
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
    padding-left: 4rem;
    padding-right: 4rem;
    padding-top: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgb(229, 231, 235);
  }

  .loading {
    padding: 5rem;
    text-align: center;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
    padding-left: 4rem;
    padding-right: 4rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    background-color: rgb(249 250 251);
  }

  label {
    text-transform: uppercase;
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
    background-color: white;
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