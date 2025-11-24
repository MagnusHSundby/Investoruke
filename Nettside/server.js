import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/chat.js', (req, res) => {
  res.sendFile(join(__dirname, 'Nettside/chat.js'));
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'Nettside/chat.html'));
});

const users = new Map();
const availableUserNumbers = [];
let maxUserNumber = 0;

function getNextUserNumber() {
  if (availableUserNumbers.length > 0) {
    return availableUserNumbers.shift();
  }
  maxUserNumber++;
  return maxUserNumber;
}

function releaseUserNumber(userNumber) {
  availableUserNumbers.push(userNumber);
  availableUserNumbers.sort((a, b) => a - b);
}

io.on('connection', (socket) => {
  const userNumber = getNextUserNumber();
  const userId = `User ${userNumber}`;
  users.set(socket.id, { name: userId, number: userNumber });
  
  console.log('✓', userId, 'connected:', socket.id);
  console.log('Total users:', users.size);
  socket.emit('user id', userId);

  io.emit('user joined', userId);
  
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);
    if (userData) {
      console.log('✗', userData.name, 'disconnected');
      io.emit('user left', userData.name);
      releaseUserNumber(userData.number);
      users.delete(socket.id);
      console.log('Total users:', users.size);
    }
  });
  socket.on('chat message', (msg) => {
    const userData = users.get(socket.id);
    if (userData) {
      if (typeof msg !== 'string') {
        console.log('Invalid message type from', userData.name);
        return;
      }
      
      const sanitizedMsg = msg.trim().substring(0, 500);
      
      if (sanitizedMsg.length === 0) {
        return;
      }
      
      console.log('Message from', userData.name + ':', sanitizedMsg);
      io.emit('chat message', { user: userData.name, message: sanitizedMsg });
    }
  });
});

server.listen(5505, '0.0.0.0', () => {
  console.log('=================================');
  console.log('Server running at:');
  console.log('port 5505');
  console.log('=================================');
});