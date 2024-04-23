<script>
// @ts-nocheck

	import TasksDoneByMe from './TasksDoneByMe.svelte';
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
    import { _accept_task, _get_tasks_done_by_me, _get_tasks_realted_to_user } from "../stores/store";
  import TaskOwnerView from './TaskOwnerView.svelte';
    let searchTerm = "";
    let uid= localStorage.getItem("uid");
    let tasksDonebyMe=""
    onMount(() => {
      _get_tasks_done_by_me(uid)
        .then((tasks) => {
          tasksDonebyMe = tasks;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    $: if (tasksDonebyMe) console.log(tasksDonebyMe);

  
  </script>
  
  <TableSearch
    placeholder="Search by category"
    hoverable={true}
    bind:inputValue={searchTerm}
  >
    <TableHead>
      <TableHeadCell>ID</TableHeadCell>
      <TableHeadCell>Category</TableHeadCell>
      <TableHeadCell>Description</TableHeadCell>
      <TableHeadCell>Created At</TableHeadCell>
      <TableHeadCell>Task Created By</TableHeadCell>
      <TableHeadCell>DeadLine</TableHeadCell>
      <TableHeadCell>Assigned To</TableHeadCell>
      <TableHeadCell>Done At</TableHeadCell>
       <TableHeadCell>Done Note</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
      {#if tasksDonebyMe.length>0}
      {#each tasksDonebyMe as item,index}
        <TableBodyRow>
          <TableBodyCell>{index+1}</TableBodyCell>
          <TableBodyCell>{item.category}</TableBodyCell>
          <TableBodyCell>
            <AccordionContent description={item.description} /></TableBodyCell
          >
          
          <TableBodyCell>{new Date(item.createdAt).toDateString()}</TableBodyCell>

          <TableBodyCell>
            <TaskOwnerView userUid={item.uid} userName={item.createdBy} /></TableBodyCell>

          <TableBodyCell>{item.needToDone}</TableBodyCell>
          <TableBodyCell>{item.assignedTo?item.assignedTo:""}</TableBodyCell>
         
           {#if item.isDone}
           {#each item.tasksDone as td (td.uid)}
           
           <TableBodyCell>{new Date(td.date).toDateString()}</TableBodyCell>
           <TableBodyCell><AccordionContent description={td.doneNote}/></TableBodyCell>
           {/each}
           {/if}
        
        </TableBodyRow>
      {/each}
      {/if}
    </TableBody>
  </TableSearch>
  