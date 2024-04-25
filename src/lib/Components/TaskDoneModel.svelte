<script>
// @ts-nocheck

  import { Button, Checkbox, Input, Modal, Select, Tooltip } from "flowbite-svelte";
  import { DollarOutline } from "flowbite-svelte-icons";
  import { _done_task, fetchUsers } from "../stores/store";
  import { onMount } from "svelte";

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
  };

  function handleSelectionChange(event) {
    const selectedUser = userMap.find(user => user.value === event);
    if (selectedUser) {
      info.userId = selectedUser.value;
      info.doneBy = selectedUser.name;
    }
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
