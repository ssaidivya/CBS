<script>
  import { Button } from "flowbite-svelte";
  import { logout } from "../stores/store";
  import CreateTask from "./CreateTask.svelte";
  import Profile from "./Profile.svelte";
  export let open = false;
  $: handleLogout = () => {
    logout();
  };
</script>

<aside
  class="fixed z-50 pt-10 mt-11 w-96 h-full bg-gray-700 border-r-2 shadow-lg"
  class:open
>
  <nav class="p-12 dark:text-white text-white space-y-10 text-xl">
    <a
      class="items-center justify-center block rounded-full text-center hover:text-black"
      href="#about"
    >
      <CreateTask />
    </a>
    <div class="absolute bottom-20 w-full pr-24">
      <a
        class="block text-center hover:border rounded-full hover:bg-blue-300 hover:text-black"
        href="#"
        on:click={handleLogout}>Logout</a
      >
    </div>
  </nav>
</aside>

<style>
  aside {
    left: -100%;
    transition: left 0.3s ease-in-out;
  }

  .open {
    left: 0;
  }
</style>
