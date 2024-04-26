<script>
  import { onMount } from "svelte";
  import { collection, query, where, orderBy, onSnapshot, getDocs, addDoc, serverTimestamp, doc } from "firebase/firestore";
  import { firestore as db } from "../../dbconfig/firebase"; 
  import { _get_user_rating } from "../stores/store";
  // @ts-ignore

  let users = [];
  let messages = [];
  let newMessage = "";
  let currentUser = localStorage.getItem("uid");
  let selectedUserId = null;

  // Fetch users excluding the current user
  async function fetchUsers() {
    const usersRef = query(collection(db, "users"), where("uid", "!=", currentUser));
    const querySnapshot = await getDocs(usersRef);
    users = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  }

  // Fetch messages between currentUser and selectedUserId
  async function fetchMessages() {
    if (!selectedUserId) return;

    const messagesRef = query(
      collection(db, "messages"),
      where("senderId", "in", [currentUser, selectedUserId]),
      where("receiverId", "in", [currentUser, selectedUserId]),
      orderBy("sentAt")
    );

    onSnapshot(messagesRef, (snapshot) => {
      // @ts-ignore
      messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.sentAt - b.sentAt);
    });
  }

  // Handle sending messages
  async function sendMessage() {
    if (newMessage.trim() === "" || !selectedUserId) return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      senderId: currentUser,
      receiverId: selectedUserId,
      sentAt: serverTimestamp(),
      messageId: Math.random().toString(36).substring(2),
      isRead:false
    });

    newMessage = "";
  }

  // Select a user to chat with
  function selectUser(uid) {
    selectedUserId = uid;
    fetchMessages();
  }
  onMount(fetchUsers);

  let ratings

  $:handleSkills=(selectedUserId)=>{
    let skills= []
   users.filter((user)=>user.uid===selectedUserId).map((user)=>{
      user.skills.map((skill)=>{
        skills.push(skill)
      })
   })
   _get_user_rating(selectedUserId).then((rating)=>{
      console.log("rating",rating);
      ratings = rating
    })
   return skills
  }
  
</script>

<div class="flex h-screen pt-4 pl-4 overflow-hidden">
  <div class="w-1/4 bg-gray-200 overflow-y-auto">
    {#if users.length > 0}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    {#each users as user}
    

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={() => selectUser(user.uid)}
        class={`cursor-pointer p-4 hover:bg-gray-300 ${selectedUserId === user.uid ? 'bg-blue-400' : ''}`}
      >
        {user.name}
      </div>
     
      {/each}
      {/if}
  </div>
  <div class="w-3/4 flex flex-col overflow-hidden">
    {#if selectedUserId}
    <!-- <div class="flex-1 overflow-y-auto p-4 space-y-2">
      {#each messages as message (message.id)}
        <div
          class="p-2 max-w-xs break-words border rounded-lg"
          class:bg-blue-100={message.sender_id === currentUser} 
          class:bg-gray-100={message.sender_id !== currentUser} 
          class:ml-auto={message.sender_id === currentUser} 
          class:mr-auto={message.sender_id !== currentUser}
        >
          {message.text}
        </div>
      {/each}
    </div> -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2 overflow-hidden">
      <div>

        <div>Skills - </div>
        <div class="flex space-x-2 pb-6">
          {#each handleSkills(selectedUserId) as skill}
            <div class="text-amber-600 font-bold text-mg border rounded-xl space-y-10">{String(skill).charAt(0).toUpperCase() + skill.slice(1)}</div>
          {/each}
        </div>
      </div>
      {#if ratings}
      <div>
        <div>Ratings - </div>
        <div class="flex space-x-2 pb-6">

          {#each ratings as rating}
          <span class="te">Task Category- </span>
          <div class="text-amber-600 font-bold text-mg">{rating.category}</div>
          <span class="te">Task Rating- </span>
          <div class="text-amber-600 font-bold text-mg">{rating.rating}</div>
          {/each}
          </div>
      </div>
      {/if}

      {#each messages as message (message.id)}
        <div class={`max-w-xs p-2 break-words border rounded-lg ${message.sender_id === currentUser ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'}`}>
          {message.text}
          {#if message.senderId=== currentUser}
          <span class="text-xs text-green-500 right-0 text-right float-right">Me</span>
          {:else}
          <span class="text-xs text-red-500 right-0 text-right float-right">{users.find(user => user.uid === selectedUserId).name}</span>
          {/if}
        </div>
      {/each}
    </div>
      <div class="p-4 flex justify-center items-center rounded-full overflow-hidden">
        <input
          class="border p-2 w-full rounded"
          bind:value={newMessage}
          placeholder="Type a message..."
        />
        <button
          class="rounded-full p-2 border bg-blue-500 text-white"
          on:click={sendMessage}>Send</button
        >
      </div>
    {:else}
      <div class="m-auto">Select a user to start chatting</div>
    {/if}
  </div>
</div>

<style>
  .ml-auto {
    display: grid;
    margin-left: auto;
    align-items: end;
    justify-content:center;
    right:0
  }
</style>
