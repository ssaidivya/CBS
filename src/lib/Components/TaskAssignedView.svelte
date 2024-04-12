<script>
  import { Button, Modal } from "flowbite-svelte";
  import { writable } from "svelte/store";
  import { get } from "svelte/store";
  import {
  _get_tasks,
    _get_user_tasks,
    _get_user_tasks_by_uid,
    getUserDBData,
    userStore,
  } from "../stores/store";
  import { onMount } from "svelte";
  let defaultModal = false;
  export let userData;
  let user = JSON.parse(localStorage.getItem("user"));
  let tasks;
  let AllTasks
  onMount(() => {
    getUserDBData(userData.uid);
  });
  onMount(() => {
    if (userData.uid) {
      _get_user_tasks(userData.uid).then((res) => {
        tasks = res;
      });
    }
  });

  onMount(()=>{
    _get_tasks().then((res)=>{
        AllTasks=res
    })
  })

  let store = get(userStore);
  console.log(
    "====================================store================================",
    store
  );
  $: if (AllTasks) {
    console.log(
      "====================================tasks================================",
      AllTasks
    );
  }
</script>

<Button on:click={() => (defaultModal = true)}
  >{userData.name === user.name ? "Me" : userData.name}</Button
>
<Modal title="Information about {user.name}" bind:open={defaultModal} autoclose>
  <div class="font-bold text-lg">Created Tasks</div>
  {#each tasks as task (task.id)}
    <div class="bg-green-50">
      <p>Task: {task.title}</p>
      <p>Created At: {new Date(task.createdAt).toDateString()}</p>
      <p>Need to Done By: {task.needToDone}</p>
    </div>
  {/each}

  <div class="font-bold text-lg">Tasks Accepted By  <span class="text-orange-500">{userData.name}</span></div>
  {#each AllTasks as task (task.id)}
    {#if task.tasksAccepted}
        {#each task.tasksAccepted as taskAccepted (taskAccepted.id)}
          {#if taskAccepted.uid === userData.uid}
            <div class="bg-green-50">
              <p>Task: {task.title}</p>
              <p>Accepted At: {new Date(taskAccepted.date).toDateString()}</p>
            
            </div>
          {/if}
        {/each}
    {/if}
  {/each}

  <svelte:fragment slot="footer">
    <Button color="alternative">Close</Button>
  </svelte:fragment>
</Modal>
