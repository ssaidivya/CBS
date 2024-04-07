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
    MessageCaptionSolid,
    DollarOutline
  } from "flowbite-svelte-icons";
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

  let items = [
    {
      id: 1,
      category: "Plumbing",
      description: "Plumbing in House Hold",
      needToDone: "02/20/2024",
    },
    {
      id: 2,
      category: "Watering",
      description: "Gardening and Watering",
      needToDone: "02/20/2024",
    },
    {
      id: 3,
      category: "Gardening",
      description: "Gardenin by cutting excess grass",
      needToDone: "02/20/2024",
    },
    {
      id: 4,
      category: "Washing machine repair",
      description: "Reair washing machine by cleaning blocks and all",
      needToDone: "02/20/2024",
    },
  ];
  $: filteredItems =
    tasks?.length &&
    tasks.filter(
      (item) =>
        item.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );

  function handleAccept(rowId) {
    console.log("Row clicked:", rowId);
    if (rowId.uid !== uid) {
      _accept_task(rowId.id, uid,user.name);
    }
  }
  function handleDone(rowId) {
    console.log("Row clicked:", rowId);
    if (rowId.uid === uid) {
      _done_task(rowId.id, uid);
    }
  }

  function goToChat() {
    navigate("/chat");
  }

  function skillMatchesCategory(user, item) {
    if (!user.skills || !item.category) return false;

    // Create a regex pattern to test case-insensitive matching
    var pattern = new RegExp("^" + item.category + "$", "i");

    // Use Array.prototype.some() to check if any skill matches the category
    return user.skills.some((skill) => pattern.test(skill));
  }
</script>

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
      <TableHeadCell>Need To Done By</TableHeadCell>
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
            <TableBodyCell>{item.needToDone}</TableBodyCell>
            <TableBodyCell on:click={() => console.log(item)}>
              {#if user}
                {#if user.skills && user.skills.includes(item.category)}
                  <div class="flex gap-3">
                    <div class="flex justify-center items-center">{item.uid===uid ?"":"Accept"}</div>
                    {#if !item.isTaskAccepted && !item.isDone && item.uid !== uid}
                      <button
                        on:click|stopPropagation={() => handleAccept(item)}
                        data-tooltip-target="tooltip-default"
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        <ArrowUpRightFromSquareSolid />
                      </button>
                    {/if}
                    {#if !item.isTaskDone && item.uid === uid}
                      <div class="flex justify-center items-center">Done</div>

                      <button
                        on:click|stopPropagation={() => handleDone(item)}
                        data-tooltip-target="tooltip-default"
                        type="button"
                        class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-blue-800"
                      >
                        <DollarOutline />
                      </button>
                    {:else}
                      <button disabled>Done</button>
                    {/if}
                    <div class="flex justify-center items-center">Chat</div>

                    <button
                      on:click|stopPropagation={goToChat}
                      data-tooltip-target="tooltip-default"
                      type="button"
                      class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-blue-800"
                    >
                      <MessageCaptionSolid />
                    </button>
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
