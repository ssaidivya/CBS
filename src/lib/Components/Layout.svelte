<script>
  import Navbar from "./Navbar.svelte";
  import Sidebar from "./Sidebar.svelte";
  let open = false;
</script>

<div class="app-layout">
  <Sidebar bind:open />
  <Navbar bind:sidebar={open} />
  <div class="content">
    <slot />
  </div>
</div>
