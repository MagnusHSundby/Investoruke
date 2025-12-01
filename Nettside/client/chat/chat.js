const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const userIdEl = document.getElementById('userId'); 

let myUserId = '';

socket.on('connect', () => {
  // console.log('Connected to server with ID:', socket.id);
  userIdEl.textContent = 'Connected, waiting for ID...'; 
});

socket.on('disconnect', () => {
  // console.log('Disconnected from server');
  userIdEl.textContent = 'Disconnected';
});

socket.on('user id', (userId) => {
  myUserId = userId;
  // console.log('You are:', userId);
  addSystemMessage(`You are ${userId}`);
  userIdEl.textContent = `User: ${userId}`; 
});

socket.on('user joined', (userId) => {
  if (userId !== myUserId) {
    addSystemMessage(`${userId} joined the chat`);
  }
});

socket.on('user left', (userId) => {
  addSystemMessage(`${userId} left the chat`);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (input.value.trim()) {
    // console.log('Sending message:', input.value);
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', (data) => {
  // console.log('Received message:', data);
  const item = document.createElement('li');
  
  const isMyMessage = data.user === myUserId;
  if (isMyMessage) {
    item.style.backgroundColor = '#d4edda';
  }
  
  const userSpan = document.createElement('strong');
  userSpan.textContent = data.user + ': ';
  
  const messageSpan = document.createElement('span');
  messageSpan.textContent = data.message;
  
  item.appendChild(userSpan);
  item.appendChild(messageSpan);
  
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight; 
});

function addSystemMessage(text) {
  const item = document.createElement('li');
  item.style.fontStyle = 'italic';
  item.style.color = '#666';
  item.style.textAlign = 'center';
  item.textContent = text;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}
