// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json");
const { log } = require("console");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const server = http.createServer(app);

// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   socket.on("joinRoom", async ({ roomId }) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   socket.on("sendMessage", async ({ roomId, message }) => {
//     log(message);
//     await db
//       .collection("messages")
//       .doc(message.sender_id)
//       .collection("chat")
//       .add({
//         ...message,
//         docId:message.receiver_id
//       });
//     io.in(roomId).emit("message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });
const io = require('socket.io')(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', async ({ message, sender_id, receiver_id }) => {
    let messageId
    db.collection('messages').add({
      message,
      sender_id,
      receiver_id,
      sent_at: admin.firestore.FieldValue.serverTimestamp(),
      isRead:false,
      
    }).then((docRef)=>{
      messageId=docRef.id
      docRef.update({
        messageId:docRef.id
      })
    }).then(()=>{
      console.log("message sent successfully")
    })

    // Broadcast the message to other clients
    socket.broadcast.emit('messageReceived', { message, sender_id, receiver_id,messageId});
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
