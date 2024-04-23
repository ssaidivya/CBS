<script>
    // @ts-nocheck
    import { Button, Modal } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { _fetch_notifications, get_user_name_by_uid, updateNotifications } from '../stores/store';
    import { Tooltip } from 'flowbite-svelte';
    let defaultModal = false;
    let notifications = "";
    let uid = localStorage.getItem("uid");
    let userNames = {};
  
    onMount(() => {
      _fetch_notifications(uid).then((res) => {
        console.log(res);
        notifications = res;
        preloadUserNames(res);
      });
    });
  
    const preloadUserNames = (notifications) => {
      notifications.forEach((notification) => {
        if (!userNames[notification.senderId]) {
          get_user_name_by_uid(notification.senderId).then((res) => {
            userNames[notification.senderId] = res;
          });
        }
      });
    };
  
    const handleReadNotification = (notificationId, messageId) => {
      console.log(notificationId);
      console.log(messageId);
      updateNotifications(notificationId, messageId);
    };
  
  </script>
  
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click={() => (defaultModal = true)} class="p-4 cursor-pointer text-white ">Chat Notifications</div>
  <Modal title="Chat Notifications" bind:open={defaultModal} autoclose>
    {#if notifications.length>0}
      {#each notifications as notification}
        {#if !notification.isRead}
        <div class="flex justify-between items-center p-4 border-b">
          <div class="flex items-center space-x-4">
            <div class="bg-gray-300 h-10 w-10 flex justify-center items-center rounded-full">
              {userNames[notification.senderId]?.charAt(0) || 'A'}
            </div>
            <Tooltip> {userNames[notification.senderId] || 'Loading...'}</Tooltip>
            <div class="flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
              <span class="hover:underline">{notification.message}</span>
              <Tooltip> {userNames[notification.senderId] || 'Loading...'}</Tooltip>
              <!-- <span class="absolute invisible whitespace-nowrap bg-gray-900 text-white py-1 px-2 rounded-md -left-16 opacity-0 transition-opacity duration-300">
                {userNames[notification.senderId] || 'Loading...'}
              </span> -->
            </div>
          </div>
          <Button
            class="bg-green-500 text-white px-4 py-2 rounded-md"
            on:click={() => handleReadNotification(notification.notificationId, notification.messageId)}
          >
            Mark as Read
          </Button>
        </div>
        {:else}
        <div class="p-4">No new notifications</div>
        {/if}
      {/each}
    {:else}
      <div class="p-4">No notifications</div>
    {/if}
    <svelte:fragment slot="footer">
      <Button class="bg-gray-500 text-white px-4 py-2 rounded-md">Close</Button>
    </svelte:fragment>
  </Modal>
  