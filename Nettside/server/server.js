import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Fix MIME type issues - set correct Content-Type headers
app.use((req, res, next) => {
  if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  } else if (req.path.endsWith('.png')) {
    res.setHeader('Content-Type', 'image/png');
  } else if (req.path.endsWith('.jpg') || req.path.endsWith('.jpeg')) {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (req.path.endsWith('.svg')) {
    res.setHeader('Content-Type', 'image/svg+xml');
  } else if (req.path.endsWith('.webp')) {
    res.setHeader('Content-Type', 'image/webp');
  } else if (req.path.endsWith('.ttf')) {
    res.setHeader('Content-Type', 'font/ttf');
  } else if (req.path.endsWith('.woff') || req.path.endsWith('.woff2')) {
    res.setHeader('Content-Type', 'font/woff2');
  }
  next();
});

// Serve static assets from client/assets
app.use('/assets', express.static(join(__dirname, '..', 'client', 'assets')));

// Serve CSS files
app.use('/css', express.static(join(__dirname, '..', 'client', 'assets', 'css')));

// Serve JS files
app.use('/js', express.static(join(__dirname, '..', 'client', 'assets', 'js')));

// Serve icons
app.use('/icons', express.static(join(__dirname, '..', 'client', 'assets', 'icons')));
app.use('/Ikoner', express.static(join(__dirname, '..', 'client', 'assets', 'icons')));

// Serve images
app.use('/images', express.static(join(__dirname, '..', 'client', 'assets', 'images')));

// Serve fonts
app.use('/fonts', express.static(join(__dirname, '..', 'client', 'assets', 'fonts')));

// Serve universalStyle.css from assets/css
app.get('/universalStyle.css', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'assets', 'css', 'universalStyle.css'));
});

// Serve all client files
app.use(express.static(join(__dirname, '..', 'client')));

// Serve home.html from client/home folder
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'home', 'home.html'));
});

// Serve the same home page for /hjem route (for backward compatibility)
app.get('/hjem', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'home', 'home.html'));
});

// Serve chat.html from client/chat folder
app.get('/chat', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'chat', 'chat.html'));
});

// Serve summary page (create this folder/file if it doesn't exist)
app.get('/summary', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'summary', 'summary.html'));
});

// Serve profile page (create this folder/file if it doesn't exist)
app.get('/profile', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'profile', 'profile.html'));
});

// Serve game pages from client/game folder
app.get('/game/blockblast', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'game', 'blockblast.html'));
});

app.get('/game/snake', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'game', 'snake.html'));
});

app.get('/game/solitaire', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'game', 'solitaire.html'));
});

app.get('/game/sudoku', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'game', 'sudoku.html'));
});

app.get('/game/tetris', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'game', 'tetris.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'game', 'game.html'));
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