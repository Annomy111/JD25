require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/volunteers', require('./routes/volunteers'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Campaign Manager API' });
});

// Socket.io Middleware für Auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io Connection Handling
io.on('connection', async (socket) => {
  console.log('New client connected:', socket.userId);

  // Benutzer dem allgemeinen Raum beitreten
  socket.join('general');

  // Lade die letzten 50 Nachrichten
  try {
    const messages = await Message.find({ room: 'general' })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('sender', 'name');
    socket.emit('message:history', messages.reverse());
  } catch (error) {
    console.error('Error loading message history:', error);
  }

  // Neue Nachricht empfangen
  socket.on('message:send', async (data) => {
    try {
      const user = await User.findById(socket.userId);
      const message = new Message({
        sender: socket.userId,
        content: data.content,
        room: 'general'
      });
      await message.save();

      io.to('general').emit('message:receive', {
        _id: message._id,
        content: message.content,
        sender: {
          _id: user._id,
          name: user.name
        },
        timestamp: message.timestamp
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Benutzer tippt
  socket.on('typing:start', () => {
    socket.to('general').emit('typing:update', { userId: socket.userId, isTyping: true });
  });

  socket.on('typing:stop', () => {
    socket.to('general').emit('typing:update', { userId: socket.userId, isTyping: false });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.userId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});