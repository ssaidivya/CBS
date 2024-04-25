<script>
// @ts-nocheck

  import { Button, Modal } from "flowbite-svelte";
  import { DatePicker,DateInput} from "date-picker-svelte";
  import { createTask } from "../stores/store";
  import { navigate } from "svelte-routing";
  import { Select, Label } from "flowbite-svelte";
  let defaultModal = false;
  let uid = localStorage.getItem("uid");
  let taskData = {
    title: "",
    category: "",
    description: "",
    needToDone: "",
  };
  $: user = JSON.parse(localStorage.getItem("user"));
  $: handleDate = (e) => {
    console.log(e.detail);
    const dateObj = new Date(e.detail);

    const formattedDate =
      (dateObj.getMonth() + 1 + "").padStart(2, "0") +
      "/" +
      (dateObj.getDate() + "").padStart(2, "0") +
      "/" +
      dateObj.getFullYear();

    taskData.needToDone = formattedDate;
  };
  $: handleSubmit = () => {
    console.log(uid);
    let taskCreationData = {
      title: taskData.title,
      category: taskData.category,
      description: taskData.description,
      needToDone: taskData.needToDone,
      uid: uid,
      createdBy: user.name,
    };
    createTask(taskCreationData);
    navigate("/home");
    defaultModal = false;
  };
  let categories = [
    { value: "plumbing", name: "Plumbing" },
    { value: "gardening", name: "Gardening Services" },
    { value: "language tutoring", name: "Language Tutoring" },
    { value: "home-coocked", name: "Home-cooked Meals" },
    { value: "fitness-traning", name: "Fitness Training" },
    { value: "homemade-crafts", name: "Homemade Crafts" },
    { value: "graphic-design", name: "Graphic Design Services" },
    { value: "computer-repair", name: "Computer Repair Services" },
    { value: "music-lessons", name: "Music Lessons" },
    { value: "photography-services", name: "Photography Services" },
    { value: "educational-tutoring", name: "Educational Tutoring" },
  ];


  function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const seconds = d.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    let today = new Date();
    let maxDate = new Date();

    // Set the minimum date to today
    today = today.toISOString().split('T')[0];

    // Set the maximum date to 5 years from today
    maxDate.setFullYear(maxDate.getFullYear() + 5);
    maxDate = maxDate.toISOString().split('T')[0];
</script>

<div class="pr-10 text-center justify-center flex">
  <Button on:click={() => (defaultModal = true)}>Create Task</Button>
  <Modal
    title="Create Task"
    bind:open={defaultModal}
    autoclose
    class="!max-h-[90vh] overflow-visible"
  >
    <div class="grid space-y-2">
      <label class="text-m font-bold text-black" for="title">Task Title</label>
      <input
        required
        bind:value={taskData.title}
        type="text"
        placeholder="Task..."
      />
    </div>
    <br />
    <div class="grid space-y-2">
      <label class="text-m font-bold text-black" for="need_to_done_by"
        >Need To Done By</label
      >
      <input type="date" min={today} max={maxDate} bind:value={taskData.needToDone} />
    </div>
    <br />
    <div class="grid space-y-2">
      <label class="text-m font-bold text-black" for="category">Category</label>
      <Select
        required
        placeholder="Choose Category"
        class="mt-2"
        items={categories}
        bind:value={taskData.category}
      />
    </div>
    <div class="grid space-y-2">
      <label
        for="description"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Description</label
      >
      <textarea
        required
        bind:value={taskData.description}
        id="description"
        rows="4"
        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Description of the task."
      ></textarea>
    </div>
    <svelte:fragment slot="footer">
      {#if taskData.description!=="" && taskData.title !== "" && taskData.category != ""}
        <Button
          disabled={taskData.description.length > 5 &&
            taskData.title !== "" &&
            taskData.category1 == ""}
          on:click={handleSubmit}>Create Task</Button
        >
      {:else}
        <!-- <Button on:click={() => alert("Please fill data properly"),defaultModal=true}
          >Create Task</Button
        > -->
      {/if}

      <Button color="alternative">Decline</Button>
    </svelte:fragment>
  </Modal>
</div>
