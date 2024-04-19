<script>
  import { Button } from "flowbite-svelte";
  import { logout } from "../stores/store";
  import CreateTask from "./CreateTask.svelte";
  import Profile from "./Profile.svelte";
  import { navigate } from "svelte-routing";
  import TasksRelatedTome from "./TasksRelatedTome.svelte";
  export let open = false;
  $: tasksRealtedToMe = false;
  $: handleLogout = () => {
    logout();
  };

  function goToChat() {
    navigate("/chat");
  }
  function goToTasksRelatedToMe() {
    open=!open
    navigate("/home/tasksrelatedtome");
    window.location.reload()
  }

  function goToTasks() {
    open=!open
    navigate("/home");
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
    <div class="pr-10 text-center justify-center flex w-full">
      <Button on:click={goToChat} class="w-34">Chat</Button>
    </div>
    {#if CurrentPath==="/home/tasksrelatedtome"}
    <div class="pr-10 text-center justify-center flex w-full">
      <Button on:click={goToTasks} class="w-34"
        >Tasks</Button
      >
    </div>
    {:else}
    <div class="pr-10 text-center justify-center flex w-full">
      <Button on:click={goToTasksRelatedToMe} class="w-34"
        >Tasks Related To Me</Button
      >
    </div>
    {/if}
    {#if CurrentPath==="/home/tasksdonebyme"}
    <div class="pr-10 text-center justify-center flex w-full">
      <Button on:click={geToTasksDoneByMe} class="w-34"
        >Tasks already Done</Button
      >
    </div>
    {:else}
    <div class="pr-10 text-center justify-center flex w-full">
      <Button on:click={geToTasksDoneByMe} class="w-34"
        >Tasks Done By Me</Button
      >
    </div>
    {/if}
    <!-- <div class="pr-10 text-center justify-center flex w-full">
     <TasksRelatedTome/>
    </div> -->
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
