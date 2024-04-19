<script>
  // @ts-nocheck

  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    TableSearch,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import AccordionContent from "./Table_Actions.svelte";
  import { _accept_task, _get_tasks_realted_to_user } from "../stores/store";
  let searchTerm = "";
  
  let uid = localStorage.getItem("uid");
  let userRealatedTasks = [];
  let user= JSON.parse(localStorage.getItem("user"))

  onMount(() => {
    _get_tasks_realted_to_user(uid)
      .then((tasks) => {
        userRealatedTasks = tasks;
      })
      .catch((error) => {
        console.log(error);
      });
  });
  $: if (userRealatedTasks) console.log(userRealatedTasks);

  function handleAccept(rowId) {
    console.log("Row clicked:", rowId);
    if (rowId.uid !== uid) {
      _accept_task(rowId.id, uid, user.name);
    }
  }
</script>

<svelte:head>
  <title>Tasks Related To Me</title>
</svelte:head>

<TableSearch
  placeholder="Search by maker name"
  hoverable={true}
  bind:inputValue={searchTerm}
>
  <TableHead>
    <TableHeadCell>ID</TableHeadCell>
    <TableHeadCell>Category</TableHeadCell>
    <TableHeadCell>Description</TableHeadCell>
    <TableHeadCell>Created By</TableHeadCell>
    <TableHeadCell>Created At</TableHeadCell>
    <TableHeadCell>DeadLine</TableHeadCell>
    <TableHeadCell>Assigned To</TableHeadCell>
    <TableHeadCell>Actions</TableHeadCell>
  </TableHead>
  <TableBody class="divide-y">
    {#if userRealatedTasks.length>0}
    {#each userRealatedTasks as item,index}
      <TableBodyRow>
        <TableBodyCell>{index+1}</TableBodyCell>
        <TableBodyCell>{item.category}</TableBodyCell>
        <TableBodyCell>
          <AccordionContent description={item.description} /></TableBodyCell
        >
        <TableBodyCell>{item.createdBy}</TableBodyCell>
        <TableBodyCell>{new Date(item.createdAt).toDateString()}</TableBodyCell>
        <TableBodyCell>{item.needToDone}</TableBodyCell>
        <TableBodyCell>{item.assignedTo?item.assignedTo:""}</TableBodyCell>
        <TableBodyCell>
          {#if !item.isTaskAccepted&& !item.isDone}
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            on:click|stopPropagation={() => handleAccept(item)}
          >
            Accept
          </button>
          {:else}
          <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          on:click={()=>alert(`Task is already accepted by ${item.assignedTo} you can't accept again`)}
        >
          Accept
        </button>
            {/if}
        </TableBodyCell>
      </TableBodyRow>
    {/each}
    {/if}
  </TableBody>
</TableSearch>
