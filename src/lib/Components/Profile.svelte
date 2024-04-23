<script>
// @ts-nocheck

  import {
    Drawer,
    Button,
    CloseButton,
    Label,
    Input,
    Textarea,
    Avatar,
  } from "flowbite-svelte";
  import { InfoCircleSolid, CalendarEditSolid } from "flowbite-svelte-icons";
  import { sineIn } from "svelte/easing";
  import avatar from "../../assets/avatar.jpg";
  import { onMount } from "svelte";
  import { _get_user_name_by_uid, _get_user_tasks, update_Profile } from "../stores/store";
  import { cubicOut } from "svelte/easing";
  let hidden4 = true;
  let transitionParams = {
    x: -320,
    duration: 400,
    easing: cubicOut,
  };

  let uid = localStorage.getItem("uid");

  let user = JSON.parse(localStorage.getItem("user"));

  let userTasks;
  let updateUser={...user}

  $: handleTaskDoneUsername = (taskDoneUID) => {
    _get_user_name_by_uid(taskDoneUID).then((res) => {
      console.log("====================================");
      console.log(res);
      console.log("====================================");
      return res;
    });
  };

  onMount(() => {
    if (uid) {
      _get_user_tasks(uid).then((res) => {
        userTasks = res;
      });
    }
  });
  let isEditing = false;

  function toggleEditMode() {
    isEditing = !isEditing;

    if (!isEditing) {
      console.log("editing off");
    }
  }
  $:handleUpdateUser=()=>{
    update_Profile(user,uid)
  }
  function focus(node) {
    node.focus();
    // Optional: move cursor to the end if the input is not empty
    if (node.value) {
      node.value = node.value;
    }
  }
  function removeSkill(index) {
    user.skills = user.skills.filter((_, i) => i !== index);
  }

</script>

<div class="text-center flex justify-center">
  <button on:click={() => (hidden4 = false)}
    ><Avatar
      on:click={() => (hidden4 = false)}
      data-name="Jese Leos"
      rounded
      src={avatar}
    /></button
  >
</div>
<Drawer
  transitionType="fly"
  {transitionParams}
  bind:hidden={hidden4}
  id="sidebar4"
  class="w-full"
>
  <div class="flex items-center">
    <h5
      id="drawer-label"
      class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
    >
      <InfoCircleSolid class="w-4 h-4 me-2.5" />Profile
    </h5>
    <CloseButton
      on:click={() => (hidden4 = true)}
      class="mb-4 dark:text-white"
    />
  </div>
  <div class="pb-4">

    <Button on:click={toggleEditMode}>Edit</Button>
  </div>
  <form action="#" class="mb-6">
    <div class="mb-6">
      <Label for="title" class="block mb-2">Name</Label>
      <Input
        disabled={!isEditing}
        id="name"
        name="name"
        required
        bind:value={user.name}
      />
    </div>
    <div class="mb-6">
      <Label for="email" class="block mb-2">Email</Label>
      <Input
        disabled={!isEditing}
        id="email"
        name="email"
        required
        bind:value={user.email}
      />
    </div>
    <div class="mb-6">
      <Label for="address" class="mb-2">Address</Label>
      <Textarea
        id="address"
        disabled={!isEditing}
        rows="4"
        bind:value={user.address}
      />
    </div>
    <div>Skills</div>
    <div
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
    >
      {#if isEditing}
        <!-- Input for each skill -->
        {#each user.skills as skill,index (skill)}
          <div class="flex gap-2">
            <input use:focus bind:value={skill} />
            <Button on:click={() => removeSkill(index)}>Remove</Button>
            
          </div>
        {/each}
       {:else}
       {#each user.skills as skill, index (skill)}
          <div class="flex gap-2">
            <Input disabled value={skill} />
            <!-- <button on:click={() => user.skills.splice(index, 1)}>Remove</button -->
            
          </div>
        {/each}
      {/if}
    </div>
  
   
    <Button on:click={handleUpdateUser} disabled={!isEditing}>
      Update
    </Button>
  </form>
</Drawer>
