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
      <div class="register-text">
        <p>
          If you don't have an account please
          <a href="/register">register</a>
        </p>
      </div>
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