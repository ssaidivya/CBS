<script>
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
  import { _get_user_name_by_uid, _get_user_tasks } from "../stores/store";
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
  let userName;

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
  <!-- <Button color="none" on:click={() => (hidden4 = false)}>
        <img class="w-10 bg-none flex items-center justify-center  h-10 rounded-full mr-5" src={avatar} alt="avatar" />
    </Button> -->
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
  <form action="#" class="mb-6">
    <div class="mb-6">
      <Label for="title" class="block mb-2">Name</Label>
      <Input disabled id="name" name="name" required value={user.name} />
      <!-- <input class="w-full h-12 border text-center" disabled={true} id="title" name="title" required value={user.name} /> -->
    </div>
    <div class="mb-6">
      <Label for="email" class="block mb-2">Email</Label>
      <Input disabled id="email" name="email" required value={user.email} />
      <!-- <input class="w-full h-12 border text-center" disabled={true} id="title" name="title" required value={user.name} /> -->
    </div>
    <div class="mb-6">
      <Label for="address" class="mb-2">Address</Label>
      <Textarea id="address" disabled rows="4" value={user.address} />
    </div>
    <div>Skills</div>
    <div
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
    >
      {#each user.skills as skill, index}
        <div
          class="flex items-center justify-center p-3 border border-gray-200 hover:border-gray-400 rounded-lg shadow-sm bg-gray-50"
        >
          <span class="text-sm text-gray-800">{skill}</span>
        </div>
      {/each}
    </div>
    <div>Tasks Related To You</div>
    {#if userTasks}
      <div
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
      >
        {#each userTasks as task, index}
          <div
            class="flex items-center justify-center p-3 border border-gray-200 hover:border-gray-400 rounded-lg shadow-sm bg-gray-50"
          >
            <span class="text-sm text-gray-800"
              >Task:{task.title}
              {" "}
              <span class=" text-red-600"
                >Need to Done By <span class=" bg-yellow-300 text-black"
                  >{task.needToDone}</span
                ></span
              ></span
            >
          </div>
        {/each}
      </div>
    {/if}

    <!-- Accepted tasks and tasks done will be here -->

    <!-- tasks created by this user -->
    <div>Tasks Already Done</div>
    {#each userTasks as task, index}
      <div
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
      >
        {#if task.isTaskDone}
          <div
            class="flex items-center justify-center p-3 border border-gray-200 hover:border-gray-400 rounded-lg shadow-sm bg-gray-50"
          >
            <span class="text-sm text-gray-800 grid"
              >Task:{task.title}
              {" "}
              {#each task.tasksDone as td, index}
                <span
                  >Done At: <span class="bg-green-500"
                    >{new Date(td.date).toDateString()}</span
                  ></span
                >
              {/each}
            </span>
          </div>
        {/if}
      </div>
    {/each}
    <div>Tasks Accepted</div>
    {#each userTasks as task, index}
      <div
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
      >
        {#if task.isTaskAccepted}
          <div
            class="flex items-center justify-center p-3 border border-gray-200 hover:border-gray-400 rounded-lg shadow-sm bg-gray-50"
          >
            <span class="text-sm text-gray-800 grid"
              >Task:{task.title}
              {" "}
              {#each task.tasksAccepted as td, index}
                <span
                  >Accepted By: {td.name}</span
                >
                <span
                  >Accepted At: <span class="bg-green-500"
                    >{new Date(td.date).toDateString()}</span
                  ></span
                >
              {/each}
            </span>
          </div>
        {/if}
      </div>
    {/each}
  </form>
</Drawer>
