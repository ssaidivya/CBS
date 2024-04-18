<script>
  import { rmtConfig } from "../../dbconfig/firebase";
  import CreateTask from "./CreateTask.svelte";
  import Profile from "./Profile.svelte";
  import {getValue} from "firebase/remote-config"

  console.log('====================================');
  console.log(getValue(rmtConfig,"welcome"));
  console.log('====================================');
</script>

<nav class="hidden md:flex text-gray-500 uppercase text-bold sm:block">

  <CreateTask/>
  <Profile/>
</nav>
