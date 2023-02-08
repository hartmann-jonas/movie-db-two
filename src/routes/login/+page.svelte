<script lang="ts">
	  import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import Icon from 'svelte-awesome';
    import spinner from 'svelte-awesome/icons/spinner';

    export let form: ActionData

    let signin = false
    let scale = 3;
  </script>
  
  <section>
    <h1>Login</h1>
    
    {#if signin}
      <h4>Signing in</h4>
      <br>
      <Icon data={spinner} pulse {scale} />
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
      <div>
        <h4>Username</h4>
        <input id="username" name="username" type="text" required />
      </div>
      
      <div>
        <h4>Password</h4>
        <input id="password" name="password" type="password" required />
      </div>
      
      {#if form?.invalid}
      <p class="error">Username and password is required.</p>
      {/if}
      
      {#if form?.credentials}
      <p class="error">You have entered the wrong credentials.</p>
      {/if}
      
      <button type="submit">Log in</button>
      <div class="register-text">
        <p>
          If you don't have an account please
          <a href="/register">register</a>
        </p>
      </div>
    </form>
    {/if}
  </section>
    
    
  <style>
    section {
      margin: auto;
        margin-top: 90px;
        text-align: center;
        width: 80%;
    }

    section h1 {
        padding-bottom: 20px;
    }

    a {
      text-decoration: underline;
      color: black;
    }

    a:hover {
      color:rgb(59, 67, 123)    }

    input {
        margin: 5px;
        padding: 10px;
        border: 2px solid rgb(69, 69, 69);
        border-radius: 3px;
        min-width: 200px;
        max-width: 500px
    }

    input:focus {
      border: 2px solid rgb(96, 110, 201);
    }

    button {
        width: 100px;
        height: 40px;
        margin: 25px;
        font-size: 15px;
        background: rgb(96, 110, 201);
        color: white;
        border: none;
        border-radius: 10px;
    }

    .register-text {
      padding: 25px;
      padding-top: 15px;
}
</style>