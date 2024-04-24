<script>
  import ChatScreen from "./lib/Components/ChatScreen.svelte";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Home from "./lib/Components/Home.svelte";
  import InfoPage from "./lib/Components/InfoPage.svelte";
  import { userStore } from "./lib/stores/store";
  import { rmtConfig } from "./dbconfig/firebase";
  import TasksRelatedTome from "./lib/Components/TasksRelatedTome.svelte";
  import Layout from "./lib/Components/Layout.svelte";
  import TasksDoneByMe from "./lib/Components/TasksDoneByMe.svelte";
  import {getValue} from "firebase/remote-config"
  let userData
  rmtConfig.settings.minimumFetchIntervalMillis = 30000;

  let val= getValue(rmtConfig, "welcome_message");

  console.log("Value from remote config🚀", val);

  onMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      userData=user
      const path = window.location.pathname;
      if (!user) {
        navigate("/", { replace: true });
      } else if (user && path === "/") {
        $userStore.uid = user.uid;
        navigate("/home");
      }
    });
  });
 
</script>

<div>
  <Router>
    {#if userData}
    <Layout>
      <Route path="/home" component={Home} />
      <Route path="/home/tasksrelatedtome" component={TasksRelatedTome} />
      <Route path="/home/tasksdonebyme" component={TasksDoneByMe} />
     
    </Layout>
    {/if}
    <Route path="/" component={InfoPage} />
    <Route path="/chat" component={ChatScreen} />
  </Router>
  
</div>
