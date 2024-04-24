<script>
  import { Button } from "flowbite-svelte";
  import { logout } from "../stores/store";
  import CreateTask from "./CreateTask.svelte";
  import { navigate } from "svelte-routing";
  import Notifications from "./Notifications.svelte";
  export let open = false;
  $: handleLogout = () => {
    logout();
  };

  function goToChat() {
    open=!open
    navigate("/chat");
  }
  function goToTasksRelatedToMe() {
    open=!open
    navigate("/home/tasksrelatedtome");
    window.location.reload()
  }

  function geToTasksDoneByMe() {
    open=!open
    navigate("/home/tasksdonebyme");
    window.location.reload()
  }
  let CurrentPath= window.location.pathname
  let home="/home"
  let uid= localStorage.getItem("uid")

  console.log("console.log(uid);",uid);
</script>

{#if uid!==null}
<aside
  class="fixed z-50 pt-10 mt-11 w-96 h-full bg-gray-700 border-r-2 shadow-lg"
  class:open
>
  <nav class="p-12 dark:text-white text-white space-y-10 text-xl">
    <a
      class="items-center justify-center block rounded-full text-center hover:text-black"
      href="#createtask"
    >
      <CreateTask />
    </a>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={goToChat} class="pr-10 cursor-pointer text-center justify-center flex w-full">
    Chat
    </div>
    
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={goToTasksRelatedToMe} class="pr-10 text-center cursor-pointer justify-center flex w-full">
     
        Tasks Related To Me
    </div>
    {#if CurrentPath==="/home/tasksdonebyme"}
    
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={geToTasksDoneByMe} class="pr-10 cursor-pointer text-center justify-center flex w-full">
     
        Tasks already Done
    </div>
    {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={geToTasksDoneByMe} class="pr-10 text-center cursor-pointer justify-center flex w-full">
      
        Tasks Done By Me
    </div>
    {/if}
    <div class="pr-10 text-center cursor-pointer justify-center">

      <Notifications/>
    </div>
   
    <div class="pr-10 text-center cursor-pointer justify-center flex bottom-25 w-full">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        class="block text-center rounded-full"
        href=""
        on:click={()=>window.location.reload}>Reload</a
      >
    </div>
    <div class="absolute bottom-20 w-full pr-24">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        class="block text-center hover:border rounded-full hover:bg-blue-300 hover:text-black"
        href=""
        on:click={handleLogout}>Logout</a
      >
    </div>
  </nav>
</aside>
{/if}

<style>
  aside {
    left: -100%;
    transition: left 0.3s ease-in-out;
  }

  .open {
    left: 0;
  }
</style>
