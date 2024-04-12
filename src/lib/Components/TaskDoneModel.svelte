<script>
  import { Button, Checkbox, Input, Modal, Select } from "flowbite-svelte";
  import { DollarOutline } from "flowbite-svelte-icons";
  import { _done_task, fetchUsers } from "../stores/store";
  import { onMount } from "svelte";

  let defaultModal = false;
  export let taskData;
  let uid = localStorage.getItem("uid");
  let users = [];
  let userMap = [];

  onMount(async () => {
    try {
      users = await fetchUsers();
      userMap = users.map(user => ({
        value: user.uid,
        name: user.name
      }));
      if (userMap.length > 0) {
        info.userId = userMap[0].value; 
        info.doneBy = userMap[0].name;
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  });

  let info = {
    userId: "",
    doneBy: "",
    doneNote: "",
    isSelfDone:""
  };

  function handleSelectionChange(event) {
    const selectedUser = userMap.find(user => user.value === event.detail);
    if (selectedUser) {
      info.userId = selectedUser.value;
      info.doneBy = selectedUser.label;
    }
  }

  function handleDoneTasks() {
    if (info.doneBy) {
      info.doneBy = "Me",
      info.doneNote = "",
      info.isSelfDone ;
    }
    _done_task(taskData.id, uid, info);
  }
</script>
<Button color="red" on:click={() => (defaultModal = true)}>
  <DollarOutline />
</Button>

<Modal title="Terms of Service" bind:open={defaultModal} autoclose>
  <Select 
    placeholder="Choose User" 
    class="mt-2" 
    items={userMap} 
    bind:value={info.userId}
    on:change={handleSelectionChange}
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
    <Checkbox bind:value={info.isSelfDone}/>
  </div>
  <svelte:fragment slot="footer">
    <Button on:click={handleDoneTasks} color="alternative">Done</Button>
  </svelte:fragment>
</Modal>
