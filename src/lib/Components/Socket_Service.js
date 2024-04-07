import { io } from 'socket.io-client';

const socket = io("http://localhost:3000");

socket.on('connect', () => {
    console.log('Socket.IO connected:', socket.id);
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });
  

export default socket;