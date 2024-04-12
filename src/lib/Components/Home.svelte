<script>
	import  Task_Mgmt  from './Task_Mgmt.svelte';
  import Sidebar from "./Sidebar.svelte";
  import Navbar from "./Navbar.svelte";
  import {get} from "svelte/store"
  import {getUserDBData, userStore} from "../stores/store"
  import { onMount } from 'svelte';
  let open = false;
  
  let uid = localStorage.getItem('uid')
  let userData={}
  onMount(() => {
    // Subscribe to userStore updates
    const unsubscribe = userStore.subscribe(($store) => {
      userData = $store.user;
    });

    getUserDBData(uid).then(()=>{
      console.log(userData)
      JSON.stringify(localStorage.setItem("user", JSON.stringify(userData)))
      return userData
    })
    return unsubscribe;
  });

  $: if (Object.keys(userData).length > 0) {
    console.log("Reactive userData:", userData);
    // Perform any other actions needed when userData updates
  }
 
 
</script>

<main class="w-screen border pt-1 fixed h-screen">
  <Sidebar bind:open />
  <Navbar bind:sidebar={open} />
  {#if (Object.keys(userData).length > 0)}
  <Task_Mgmt user={userData}/>
  {/if}
</main>
