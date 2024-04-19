<script>
  // @ts-nocheck

  import {
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import AccordionContent from "./Table_Actions.svelte";
  import { onMount } from "svelte";
  import {
    _accept_task,
    _done_task,
    _get_tasks,
    getData,
  } from "../stores/store";
  import { Link, navigate } from "svelte-routing";
  import {
    ArrowUpRightFromSquareSolid,
  } from "flowbite-svelte-icons";
  import TaskAssignedView from "./TaskAssignedView.svelte";
  import TaskDoneModel from "./TaskDoneModel.svelte";
  let searchTerm = "";
  export let user;
  let data;
  onMount(() => {
    getData().then((usersData) => {
      data = usersData;
    });
  });
  let tasks;
  onMount(() => {
    _get_tasks().then((tasksData) => {
      console.log("🚀", tasksData);
      tasks = tasksData;
    });
  });

  $: if (tasks?.length) {
    console.log("tasks ☺️", tasks);
  }

  $: if (data) {
    console.log(data);
  }
  let uid = localStorage.getItem("uid");

  $: if (tasks?.length) {
    console.log("tasks ☺️", tasks);
  }
  $: filteredItems =
    tasks?.length > 0 &&
    tasks.filter(
      (item) =>
        item.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );

  function handleAccept(rowId) {
    console.log("Row clicked:", rowId);
    if (rowId.uid !== uid) {
      _accept_task(rowId.id, uid, user.name);
    }
  }
  function handleDone(rowId) {
    console.log("Row clicked:", rowId);
    if (rowId.uid === uid) {
      _done_task(rowId.id, uid);
    }
  }

  $: if (filteredItems?.length) {
    console.log("filteredItems ☺️", filteredItems);
  }
</script>

<svelte:head>
  <title>Tasks</title>
</svelte:head>

<div class="w-screen h-screen pl-8 pr-8 pt-8 border border-b-gray-950">
  <TableSearch
    placeholder="Search by task"
    hoverable={true}
    bind:inputValue={searchTerm}
  >
    <TableHead>
      <TableHeadCell>ID</TableHeadCell>
      <TableHeadCell>Category</TableHeadCell>
      <TableHeadCell>Description</TableHeadCell>
      <TableHeadCell>Created By</TableHeadCell>
      <TableHeadCell>DeadLine</TableHeadCell>
      <TableHeadCell>Is Task Done</TableHeadCell>
      <TableHeadCell>Done By</TableHeadCell>
      <TableHeadCell>Assigned To</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#if tasks?.length}
        {#each filteredItems as item, index}
          <TableBodyRow>
            <TableBodyCell><Link to="/chat">{index + 1}</Link></TableBodyCell>
            <TableBodyCell>{item.category}</TableBodyCell>
            <TableBodyCell>
              <AccordionContent description={item.description} /></TableBodyCell
            >
            <TableBodyCell>{item.createdBy}</TableBodyCell>
            <TableBodyCell>{item.needToDone}</TableBodyCell>
            <TableBodyCell>{item.isDone ? "Yes" : "No"}</TableBodyCell>
            <TableBodyCell>
              {#if item.tasksDone.length}
                {#each item.tasksDone as task, index}
                  <div>{task.doneBy}</div>
                {/each}
              {/if}
            </TableBodyCell>
            <TableBodyCell>
              {#if item.isTaskAccepted}
                {#each item.tasksAccepted as ta (ta.uid)}
                  <TaskAssignedView userData={ta} />
                {/each}
              {/if}
            </TableBodyCell>
            <TableBodyCell on:click={() => console.log(item)}>
              {#if user}
                {#if user.skills && user.skills.includes(item.category)}
                  <div class="flex gap-3">
                    <div class="flex justify-center items-center">
                      {item.uid === uid ? "Created By Me" : ""}
                    </div>
                    {#if !item.isTaskAccepted && !item.isDone && item.uid !== uid}
                      <div class="flex justify-center items-center">Accept</div>
                      <button
                        on:click|stopPropagation={() => handleAccept(item)}
                        data-tooltip-target="tooltip-default"
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <ArrowUpRightFromSquareSolid />
                      </button>
                    {/if}
                    {#if !item.isDone && item.uid === uid}
                      <div class="flex justify-center items-center">Done</div>
                      <TaskDoneModel taskData={item} />
                    {:else}
                      <div>Already Done</div>
                    {/if}
                    <!-- {#if item.uid===uid}
                   
                    <button
                        on:click|stopPropagation={() => handleDone(item)}
                        data-tooltip-target="tooltip-default"
                        type="button"
                        class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-blue-800"
                      >
                      Task Completed
                      </button>
                    {/if} -->
                  </div>
                {/if}
              {/if}
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      {/if}
    </TableBody>
  </TableSearch>
</div>
