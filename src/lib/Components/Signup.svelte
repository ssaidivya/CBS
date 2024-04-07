<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { navigate } from "svelte-routing";
  import { createUser } from "../stores/store";

  let user = {
    name: "",
    email: "",
    password: "",
    address: "",
    skills: [],
  };
  let skillInput = "";
  const addSkill = () => {
    if (skillInput.trim() !== "" && !user.skills.includes(skillInput)) {
      user.skills = [...user.skills, skillInput];
      skillInput = "";
    }
  };

  const removeSkill = (skillToRemove) => {
    console.log(skillToRemove);
    user.skills = user.skills.filter((skill, i) => i !== skillToRemove);
  };

  let errorMessages = [];
  let passwordStrength = 0;

  const dispatch = createEventDispatcher();

  const handleChange = (e) => {
    user[e.target.id] = e.target.value;
    if (e.target.id === "password") {
      validatePassword(e.target.value);
    }
  };

  const validatePassword = (password) => {
    let score = 0;
    errorMessages = [];
    const criteria = [
      { regex: /.{6,}/, message: "At least 6 characters", score: 20 },
      { regex: /[A-Z]/, message: "At least one uppercase letter", score: 20 },
      { regex: /[a-z]/, message: "At least one lowercase letter", score: 20 },
      { regex: /\d/, message: "At least one number", score: 20 },
      { regex: /[\W_]/, message: "At least one special character", score: 20 },
    ];

    criteria.forEach(({ regex, message, score: increment }) => {
      if (regex.test(password)) {
        score += increment;
      } else {
        errorMessages.push(message);
      }
    });

    passwordStrength = score;
  };

  $: handleSubmit = () => {
    console.log(user.skills);
    createUser({
      name: user.name,
      email: user.email,
      password: user.password,
      address: user.address,
      skills: user.skills,
    });
  };

  // For Google Sign-In, you would implement a separate function
  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic here
    console.log("Google Sign-In");
  };
</script>

<svelte:head>
  <title>Login Page</title>
</svelte:head>

<section id="signup">
  <div class="flex pt-20 text-center justify-center items-center">
    <div class="w-screen max-w-xl">
    <p class="text-4xl font-bold text-black">Task Sender <span class="font-bold text-green-500 text-4xl">Register</span></p>

      <form
        on:submit|preventDefault={handleSubmit}
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="flex -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="name"
            >
              Name
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="name"
              type="text"
              placeholder="Full Name"
              bind:value={user.name}
            />
          </div>
          <div class="w-full md:w-1/2 px-3">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="email"
            >
              Email
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="email"
              type="email"
              placeholder="emample@example.com"
              bind:value={user.email}
            />
          </div>
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            on:input={handleChange}
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
            bind:value={user.password}
          />
          <progress value={passwordStrength} max="100" class="w-full"
          ></progress>
          <p class="text-xs mt-2">Password strength: {passwordStrength}%</p>
          {#if errorMessages.length > 0}
            <p class="text-red-500 text-xs italic">
              Please fix the following errors:
            </p>
            <ul class="text-red-500 text-xs italic">
              {#each errorMessages as message}
                <li>{message}</li>
              {/each}
            </ul>
          {/if}
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="address"
          >
            Address
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="123 Main St"
            bind:value={user.address}
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="skills"
          >
            Skills
          </label>
          <div class="flex items-center">
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              id="skills"
              type="text"
              placeholder="Add a skill"
              bind:value={skillInput}
              on:keydown={(e) => e.key === "Enter" && addSkill()}
            />
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              on:click={addSkill}
            >
              Add
            </button>
          </div>
          {#if user.skills.length > 0}
            <ul class="mt-2">
              {#each user.skills as skill, index}
                <li class="flex justify-between items-center mt-2">
                  {skill}
                  <button
                    type="button"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    on:click={() => removeSkill(index)}
                  >
                    Remove
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
        <div class="flex items-center justify-between">
          <a
            class="inline-block underline text-m align-baseline font-bold text-blue-500 hover:text-blue-800"
            href="/login"
            >Having Account
          </a>
        </div>
        <div class="flex items-center justify-between w-full pt-2">
          <button
            class="w-screen h-8 border text-lg font-semibold bg-gray-400 hover:bg-blue-600 border-spacing-8 border-1"
            >Signup</button
          >
        </div>
      </form>
    </div>
  </div>
</section>
