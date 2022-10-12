<script lang="ts">
    import type { ActionData } from './$types'
  
    export let form: ActionData
  </script>
  
  <h1>Login</h1>
  
  <form action="?/login" method="POST">
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
  </form>
  