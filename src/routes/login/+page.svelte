<script lang="ts">
    import type { ActionData } from './$types'
  
    export let form: ActionData
  </script>
  
  <section>
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
      
      <p>If you don't have an account please</p>
      <a href="/register">register</a>
    </form>
  </section>
    
    
  <style>
    section {
      margin: auto;
        margin-top: 90px;
        text-align: center;
        width: 50%;
    }

    section h1 {
        padding-bottom: 20px;
    }

    a {
      text-decoration: none;
      color: black;
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