<script>
    import { TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
    import AccordionContent from "./Table_Actions.svelte"
    let searchTerm = '';
    let items = [
      { id: 1, task: 'Plumbing', type: 'ABC', },
      { id: 2, task: 'Watering', type: 'CDE', },
      { id: 3, task: 'Gardening', type: 'FGH', },
      { id: 4, task: 'Washing machine repair', type: 'IJK', }
    ];
    $: filteredItems = items.filter((item) => item.task.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  </script>
  
  <div class="w-screen h-screen pl-8 pr-8 pt-8 border border-b-gray-950">
    

  <TableSearch placeholder="Search by task" hoverable={true} bind:inputValue={searchTerm}>
    <TableHead>
      <TableHeadCell>ID</TableHeadCell>
      <TableHeadCell>Task</TableHeadCell>
      <TableHeadCell>Type</TableHeadCell>
      <TableHeadCell>Description</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each filteredItems as item}
        <TableBodyRow>
          <TableBodyCell>{item.id}</TableBodyCell>
          <TableBodyCell>{item.task}</TableBodyCell>
          <TableBodyCell>{item.type}</TableBodyCell>
          <TableBodyCell>
            <AccordionContent description={item.description} />
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </TableSearch>

</div>
