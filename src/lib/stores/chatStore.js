// src/stores/userStore.js
import { writable } from 'svelte/store';

function createUserStore() {
  const { subscribe, set, update } = writable(null); // Initial state is null, indicating no user is logged in

  return {
    subscribe,
    setUser: (user) => set(user), // Function to set the current user
    clearUser: () => set(null), // Function to clear the current user (logout)
  };
}

export const userStore = createUserStore();
