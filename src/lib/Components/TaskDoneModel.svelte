<script>
// @ts-nocheck

  import { Button, Checkbox, Input, Modal, Select, Tooltip } from "flowbite-svelte";
  import { DollarOutline } from "flowbite-svelte-icons";
  import { _done_task, fetchUsers } from "../stores/store";
  import { onMount } from "svelte";
  import Rating from "./Rating.svelte";

  let defaultModal = false;
  export let taskData;
  let uid = localStorage.getItem("uid");
  let users = [];
  let userMap = [];



  console.log("tasksData",taskData);

  onMount(async () => {
    try {
      users = await fetchUsers();
      userMap = users.map(user => ({
        value: user.uid,
        name: user.name
      }));
      userMap=userMap.filter(user => user.value !== uid);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  });

  let info = {
    userId: "",
    doneBy: "",
    doneNote: "",
    isSelfDone:false,
    rating: 0
  };

  function handleSelectionChange(event) {
    const selectedUser = userMap.find(user => user.value === event);
    if (selectedUser) {
      info.userId = selectedUser.value;
      info.doneBy = selectedUser.name;
    }
  }

  function handleStarClicked(event) {
    info.rating = event.detail;
  }

  function handleDoneTasks() {
    if (info.isSelfDone) {
      info.doneBy = "Me",
      info.doneNote = "",
      info.isSelfDone =true;
      info.userId=uid
    }else{
      info.isSelfDone =false;
      info.doneBy=taskData.tasksAccepted[0].name,
      info.doneNote,
      info.userId = taskData.tasksAccepted[0].uid
    }
    console.log("Done Task:", info.doneBy);
    _done_task(taskData.id, uid, info);
  }


</script>

<!-- {#if taskData.isTaskAccepted} -->
<Button color="red" on:click={() => (defaultModal = true)}>
  <DollarOutline />
</Button>
<!-- {/if} -->
<Tooltip>Done</Tooltip>

<Modal title="Task Done By" bind:open={defaultModal} autoclose>
  <!-- <Select 
    placeholder="Choose User" 
    class="mt-2" 
    items={userMap} 
    bind:value={info.userId}
    on:change={(e)=>handleSelectionChange(e.target.value)}
  /> -->
  <Input
    placeholder=""
    id="doneNote" 
    name="doneNote" 
    required 
    disabled
   value={!taskData.isTaskAccepted?"No One accepted till now":taskData.assignedTo}
  />
  <Input
    placeholder="Enter your note to complete this task"
    id="doneNote" 
    name="doneNote" 
    required 
    bind:value={info.doneNote}
  />
  <div class="flex items-center">
    <label>Rate:</label>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="stars" on:click={e => handleStarClicked(e)}>
      {#each [1, 2, 3, 4, 5] as starValue}
        <span class="star" style="color: {starValue <= info.rating ? 'gold' : 'gray'}">&#9733;</span>
      {/each}
    </div>
    <span class="ml-2">Rating: {info.rating}</span>
  </div>
  <div class="flex">

    <label for="isSelfDone" class="block text-sm font-medium pr-3 text-orange-500">Done By Me</label>
    <Checkbox disabled={!taskData.isTaskAccepted} bind:checked={info.isSelfDone}/>
  </div>
  <svelte:fragment slot="footer">
   {#if taskData.isTaskAccepted}
      <Button on:click={handleDoneTasks} color="alternative">Done</Button>
      {:else}
      <Button on:click={() => (defaultModal = false)} color="alternative">Cancel</Button>
   {/if}
  </svelte:fragment>
</Modal>


<style>
  .star {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: transparent;
    margin-right: 5px;
    cursor: pointer;
  }

  .star svg {
    fill: none;
    stroke: #ff9900; /* Amazon's star color */
    stroke-width: 1.5px;
    stroke-linejoin: round;
    stroke-linecap: round;
    transition: stroke 0.2s ease;
    cursor: pointer;
  }

  .star:hover svg,
  .star.filled svg {
    stroke: #ff9900; /* Change color on hover or when filled */
  }
</style>