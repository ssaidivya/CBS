<script>
  import avatar from "../../assets/avatar.jpg";
  import { userStore } from "../stores/store";
  import Login from "./Login.svelte";
  import Signup from "./Signup.svelte";
  import bgImage from "../../assets/bg4.jpg";
  import loginImage from "../../assets/login.jpg";
  import signUpImage from "../../assets/signup.jpg";
  let user = $userStore.uid;

  function scrollTo(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    if (user) {
      window.location.href = "/home";
    }
  }
</script>

<div class="bg-cover bg-center w-full h-64 sm:h-48">
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div
      class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4"
    >
      <a
        href="/"
        class="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          width="30"
          height="30"
          viewBox="0 0 256 256"
          xml:space="preserve"
          color="green"
          class="text-green-600"
          fill="none"
        >
          <defs> </defs>
          <g
            style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
          >
            <path
              d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z"
              style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(4,136,219); fill-rule: nonzero; opacity: 1;"
              transform=" matrix(1 0 0 1 0 0) "
              stroke-linecap="round"
            />
            <path
              d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z"
              style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"
              transform=" matrix(1 0 0 1 0 0) "
              stroke-linecap="round"
            />
          </g>
        </svg>
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >Community Bartering System</span
        >
      </a>
      <div class="flex items-center space-x-6 rtl:space-x-reverse">
        <button
          class="text-lg font-bold text-gray-600 hover:underline"
          on:click={() => scrollTo("login")}>Home</button
        >

        <button
          class="text-lg text-blue-600 font-bold dark:text-blue-500 hover:underline"
          on:click={() => scrollTo("login")}>Login</button
        >
        <button
          class="text-lg text-green-600 font-bold dark:text-green-500 hover:underline"
          on:click={() => scrollTo("signup")}>Register</button
        >
      </div>
    </div>
  </nav>
  <section
    class="w-full h-screen bg-no-repeat bg-cover border bg-black flex items-center justify-center relative gray-filter"
    style="background-image: url({bgImage});"
  >
    <div>
      <p class="font-bold text-7xl text-slate-800 tracking-wide text-wrap">
        Community Bartering
      </p>
      <span
        class="text-7xl flex items-center justify-center text-wrap tracking-wide font-bold text-slate-800"
        >System</span
      >
    </div>
  </section>

  <section class="flex justify-end pr-24 w-full h-screen pt-24" id="login">
    <div class="w-1/2 h-full bg-cover bg-center bg-fixed rounded-full">
      <img class="bg-slate-100" src={loginImage} alt="login_image" />
    </div>
    <Login />
  </section>
  <hr />
  <section class="flex pl-24 w-full h-screen" id="signup">
    <Signup />
    <div class="w-1/2 h-full bg-cover bg-center">
      <img src={signUpImage} alt="login_image" />
    </div>
  </section>
</div>

<style>
  .gray-filter::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("path-to-your-image.jpg"); /* Replace with your bgImage variable */
    background-size: cover;
    background-position: center;
    filter: grayscale(200%); /* Apply grayscale filter */
    z-index: -1;
    background-color: red;
  }
</style>
