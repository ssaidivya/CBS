<script>
  import Task_Mgmt from "./Task_Mgmt.svelte";
  import { getUserDBData, userStore } from "../stores/store";
  import { onMount } from "svelte";

  let uid = localStorage.getItem("uid");
  let userData = {};
  onMount(() => {
    const unsubscribe = userStore.subscribe(($store) => {
      userData = $store.user;
    });

    getUserDBData(uid).then(() => {
      console.log("userData",userData);
      JSON.stringify(localStorage.setItem("user", JSON.stringify(userData)));
      return userData;
    });
    return unsubscribe;
  });
  console.log("userDatafuc",userData);
  $: if (Object.keys(userData).length > 0) {
    console.log("Reactive userData:", userData);
  }
</script>

<main class="w-screen border pt-1 fixed h-screen">
  
  {#if Object.keys(userData).length > 0}
    <Task_Mgmt user={JSON.parse(localStorage.getItem("user"))} />
   
  {/if}
</main>
