<script>
    import { Button, Modal } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { _get_tasks, _get_user_tasks } from '../stores/store';
    let defaultModal = false;

    export let userName
    //user uid is the user who the task is created
    export let userUid

    console.log('====================================fuck');
    console.log(userUid);
    console.log('====================================');
    let tasks
    onMount(()=>{
        _get_user_tasks(userUid).then((res)=>{
            tasks=res
        }).catch((error)=>{
            console.log(error)
        })
    })
    let allTasks
    onMount(()=>{
        _get_tasks().then((tasks)=>{
            allTasks=tasks
        }).catch((error)=>{
            console.log(error)
        })
    })
    $: if(tasks) console.log(tasks)
  </script>
  
  <Button on:click={() => (defaultModal = true)}>{userName}</Button>
  <Modal title="Terms of Service" bind:open={defaultModal} autoclose>
    <div class="font-bold text-lg">Created Tasks</div>
  {#each tasks as task (task.id)}
    <div class="bg-green-50">
      <p>Task: {task.category}</p>
      <p>Created At: {new Date(task.createdAt).toDateString()}</p>
      <p>Need to Done By: {task.needToDone}</p>
    </div>
  {/each}

  <!-- get the tasks of this particular person accepted before-->
    <div class="font-bold text-lg">Tasks Accepted By  <span class="text-orange-500">{userName}</span></div>
    {#each allTasks as task (task.id)}
     
        {#each task.tasksAccepted as ta (ta.id)}
            {#if ta.uid === userUid}
              <div class="bg-green-50">
                <p>Task: {task.title}</p>
                <p>Accepted At: {new Date(ta.date).toDateString()}</p>
              </div>
            {/if}
        {/each}
     
    {/each}

    <!-- get the tasks of this particular person done previous -->
    <div class="font-bold text-lg">Tasks Done By  <span class="text-orange-500">{userName}</span></div>
    {#each allTasks as task (task.id)}
      {#if task.isDone}
          {#each task.tasksDone as taskDone (taskDone.id)}
            {#if taskDone.doneUserId === userUid}
              <div class="bg-green-50">
                <p>Task: {task.title}</p>
                <p>Done At: {new Date(taskDone.date).toDateString()}</p>
              </div>
            {/if}
          {/each}
      {/if}
    {/each}
    <svelte:fragment slot="footer">
      <Button on:click={() => alert('Handle "success"')}>I accept</Button>
      <Button color="alternative">Decline</Button>
    </svelte:fragment>
  </Modal>