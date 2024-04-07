<script>
	import ChatScreen from './lib/Components/ChatScreen.svelte';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Home from "./lib/Components/Home.svelte";
  import InfoPage from "./lib/Components/InfoPage.svelte";
  import { userStore } from "./lib/stores/store";
  onMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const path = window.location.pathname;
      if (!user) {
        navigate("/", { replace: true });
      } else if (user && (path === "/")) {
        $userStore.uid=user.uid
        navigate("/home");
      }
    });
  });
</script>

<div>
  <Router>
    <Route path="/home" component={Home} />
    <Route path="/" component={InfoPage} />
    <Route path="/chat" component={ChatScreen} />
    
  </Router>
</div>
