<script>
  import { Button } from "flowbite-svelte";
  import { rmtConfig } from "../../dbconfig/firebase";
  import CreateTask from "./CreateTask.svelte";
  import Profile from "./Profile.svelte";
  import {getValue} from "firebase/remote-config"
  import { navigate } from "svelte-routing";

  console.log('====================================');
  console.log(getValue(rmtConfig,"welcome"));
  console.log('====================================');
  let location= window.location.pathname

  const handleGoToHome=()=>{
    navigate("/home")
  }
</script>

<nav class="hidden md:flex text-gray-500 uppercase text-bold sm:block">
  {#if location!=="/home"}
  <div class="pr-4">

    <Button on:click={handleGoToHome}>Home</Button>
  </div>
  
  {/if}
  <CreateTask/>
  <Profile/>

</nav>
