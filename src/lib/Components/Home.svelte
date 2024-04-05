<script>
	import  Task_Mgmt  from './Task_Mgmt.svelte';
  import Sidebar from "./Sidebar.svelte";
  import Navbar from "./Navbar.svelte";
  import {get} from "svelte/store"
  import {userStore} from "../stores/store"
  let open = false;

  console.log($userStore.uid)
</script>

<main class="w-screen border pt-1 fixed h-screen">
  <Sidebar bind:open />
  <Navbar bind:sidebar={open} />
  <Task_Mgmt/>
</main>
