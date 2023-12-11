const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const messages = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  let username = ''; // Store the username for each user

  // Listen for username input and set the username
  socket.on('set_username', (user) => {
    username = user.trim();
  });

  // Send the current messages to the new user
  socket.emit('update_messages', messages);

  socket.on('new_message', (data) => {
    if (username !== '') {
      messages.push(`${username}: ${data}`);
      io.emit('update_messages', messages);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});