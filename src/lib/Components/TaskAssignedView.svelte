<script>
  import { Button, Modal } from "flowbite-svelte";
  import { writable } from "svelte/store";
  import { get } from "svelte/store";
  import {
  _get_tasks,
    _get_user_reviews_of_tasks_done,
    _get_user_tasks,
    _get_user_tasks_by_uid,
    getUserDBData,
    get_user_name_by_uid,
    userStore,
  } from "../stores/store";
  import { onMount } from "svelte";
  let defaultModal = false;
  export let userData;
  let user = JSON.parse(localStorage.getItem("user"));
  let userid = localStorage.getItem("uid")
  let tasks;
  let AllTasks
  let reviews
  let usernames=[]
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

  onMount(()=>{
    _get_user_reviews_of_tasks_done(userData.uid).then((res)=>{
      reviews=res
    }).catch((err)=>{
      console.log(err);
    })
  })
  console.log("reviews",reviews)

  async function fetchUserName(ruid) {
    try {
      const username = await get_user_name_by_uid(ruid);
      if(ruid===userid){
        return "Me"
      }
      return username.charAt(0).toUpperCase()+username.slice(1);
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown"; 
    }
  }

</script>

<Button on:click={() => (defaultModal = true)}
  >{userData.name === user.name ? "Me" : userData.name}</Button
>
<Modal title="Information about {userData.name===user.name?"Me":userData.name}" bind:open={defaultModal} autoclose>
  <div class="font-bold text-lg">Created Tasks</div>
  {#each tasks as task (task.id)}
    <div class="bg-green-50">
      <p>Task: {task.category}</p>
      <p>Created At: {new Date(task.createdAt).toDateString()}</p>
      <p>Need to Done By: {task.needToDone}</p>
    </div>
  {/each}

  <div class="font-bold text-lg">Tasks Accepted By  <span class="text-orange-500">{userData.name===user.name?"Me":userData.name}</span></div>
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

  <div class="font-bold text-lg">Comments on Tasks for <span class="text-orange-500">{userData.name === user.name ? "Me" : userData.name}</span></div>
{#each reviews as review (review.taskId)}
  <div class="bg-green-10">
    <p><span class="">Task:</span> {review.title}</p>
    <p>Abut Task: {review.description}</p>
    <p><span class="text-green-600">Comment:</span> {review.comment}</p>
    <!-- Use an await block to fetch and display the username -->
    <p><span class="text-blue-600">Reviewed By:</span> {#await fetchUserName(review.reviewedBy)}
      <span>Loading...</span> {:then username}
      {username}
    {/await}</p>
  </div>
{/each}
  <svelte:fragment slot="footer">
    <Button color="alternative">Close</Button>
  </svelte:fragment>
</Modal>
