<script>
	//Set the start variables
	let inputValue = '';
	let active = false;

	//Import the redirect from svelte
	import { goto } from '$app/navigation';
	//Import the fly animation from svelte
	import { fly } from 'svelte/transition';

	//Function to show the text in the searchbar
	//Not done as a placeholder="" because the animation would not work
	function cancelInactive() {
		if (inputValue) {
			active = true;
		} else {
			active = false;
		}
	}
	//Submit the search and go to the /search/ + searchedTitle directory
	function submitSearch() {
		goto('/search/' + inputValue);
	}
</script>

<form on:submit|preventDefault={submitSearch} class="search">
	<!--Animation to fly in the lable from the top when nothing is in the input-->
	{#if !active}
		<label in:fly={{ y: -10, duration: 500 }} out:fly={{ y: -10, duration: 500 }} for="search_movie"
			>Search Movie</label
		>
	{/if}
	<input
		name="search_movie"
		type="text"
		class={active ? 'selected' : ''}
		on:blur={cancelInactive}
		on:focus={() => (active = true)}
		bind:value={inputValue}
	/>
	<!--If there is a text in the input -> show the search button-->
	{#if inputValue}
		<!--<button in:fly={{ x: 10, duration: 500 }} out:fly={{ x: 0, duration: 500 }}>Search</button>-->
		<button in:fly={{ x: 0, duration: 500 }} out:fly={{ x: 0, duration: 500 }}>Search</button>
	{/if}
</form>

<style>
	.search {
		position: relative;
		/*width: 40%;*/
		margin: 1rem;
	}

	button {
		font-size: 0.9rem;
		padding: 0rem 1rem;
		background: rgb(96, 110, 201);
		color: white;
		font-weight: bold;
		border: none;
		position: absolute;
		bottom: 50%;
		right: 0;
		transform: translate(0, 50%);
		height: 100%;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		cursor: pointer;
	}

	input {
		width: 100%;
		border: none;
		font-size: 1rem;
		font-family: 'Poppins', sans-serif;
		outline: none;
		color: rgb(255, 255, 255);
		padding: 0.5rem 0.1rem;
		transition: background 0.7s ease-out;
		font-weight: bold;
		background: rgb(63, 63, 63);
		border-radius: 10px;
		padding: 1rem;
	}

	label {
		position: absolute;
		font-size: 0.7rem;
		top: 50%;
		left: 0;
		transform: translate(0, -50%);
		pointer-events: none;
		color: #fff;
		padding: 0rem 1rem;
	}

	input.selected {
		background: rgb(50, 50, 50);
	}
</style>
