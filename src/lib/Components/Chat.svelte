<script>
  import { onMount } from "svelte";
  import { collection, query, where, orderBy, onSnapshot, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
  import { firestore as db } from "../../dbconfig/firebase"; // Import your Firestore configuration
  // @ts-ignore
  import socket from "./Socket_Service"; // Import your configured Socket.IO client

  let users = [];
  let messages = [];
  let newMessage = "";
  let currentUser = localStorage.getItem("uid"); // Assume this is set when your user logs in
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
    });

    newMessage = "";
  }

  // Select a user to chat with
  function selectUser(uid) {
    selectedUserId = uid;
    fetchMessages();
  }

  onMount(fetchUsers);
</script>




<div class="flex h-screen pt-4 pl-4">
  <div class="w-1/4 bg-gray-200 overflow-y-auto">
    {#if users.length > 0}
    {#each users as user}
    
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        on:click={() => selectUser(user.uid)}
        class="cursor-pointer p-4 hover:bg-gray-300"
      >
      
        {user.name}
      </div>
     
      {/each}
      {/if}
  </div>
  <div class="w-3/4 flex flex-col">
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
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
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
      <div class="p-4 flex justify-center items-center rounded-full">
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
