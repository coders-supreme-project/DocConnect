const express = require('express');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});

app.use(
  cors({
    origin:"*",
  })
);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('join', (roomId) => {
    console.log('user join room', roomId);
    socket.join(roomId);
  });

  socket.on('chat_message', (msg) => {
    try {
      msg.MessageID = uuidv4();
      socket.to(msg.ChatroomID).emit('chat_message', msg);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
