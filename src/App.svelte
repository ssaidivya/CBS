<script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { Router, Route, navigate } from "svelte-routing";
  import Login from "./lib/Components/Login.svelte";
  import { onMount } from "svelte";
  import Home from "./lib/Components/Home.svelte";
  import Signup from "./lib/Components/Signup.svelte";
  onMount(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const path = window.location.pathname;
      if (!user && path !== "/login" && path !== "/signup") {
        navigate("/login", { replace: true });
      } else if (user && (path === "/login" || path === "/signup")) {
       
        navigate("/");
      }
    });
  });
</script>

<div>
  <Router>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
  </Router>
</div>
