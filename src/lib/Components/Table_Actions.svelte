<!-- AccordionContent.svelte -->
<script>
    export let description = ''; // Placeholder for the detailed content
    let isVisible = false;
  
    function toggleVisibility() {
      isVisible = !isVisible;
    }
  </script>
  
  <button on:click={toggleVisibility} class="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
    {#if isVisible}
      Hide Details
    {:else}
      Show Details
    {/if}
  </button>
  
  {#if isVisible}
    <div class="mt-2 p-4 border rounded bg-gray-100">
      {description}
    </div>
  {/if}
  