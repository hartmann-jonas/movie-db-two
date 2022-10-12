<script lang="ts">
	//Import the fly animation from svelte
	import { fly } from 'svelte/transition';
  import type { ActionData } from './$types'
  export let form: ActionData
</script>

<section in:fly={{ y: -40, duration: 500, delay: 500 }} out:fly={{ y: -40, duration: 500 }}>
  <h1>Register now</h1>
    <form action="?/register" method="POST">
        <div>
          <h4>Username</h4>
          <input id="username" name="username" type="text" required />
        </div>
      
        <div>
          <h4>Password</h4>
          <input id="password" name="password" type="password" required />
        </div>
        
        {#if form?.user}
          <p class="error">Username is taken.</p>
        {/if}

        <button type="submit">Register</button>
      </form>      
</section>



<style>
    section {
        padding: 15px;
        margin-top: 90px;
        text-align: center;
    }

    section h1 {
        padding-bottom: 20px;
    }

    input {
        margin: 5px;
        padding: 10px;
    }

    button {
        width: 70px;
        height: 40px;
        margin: 15px;
        font-weight: bold;
    }
</style>