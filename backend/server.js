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

// Online users tracking
const onlineUsers = new Map();

app.use(cors());
app.use(express.json());

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
app.use('/api/events', require('./routes/events'));

// Socket Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket Connection Handling
io.on('connection', async (socket) => {
  console.log('User connected:', socket.user.name);
  
  // Add user to online users
  onlineUsers.set(socket.user._id.toString(), {
    socketId: socket.id,
    user: socket.user
  });
  
  // Broadcast online users
  io.emit('users:online', Array.from(onlineUsers.values()).map(u => ({
    _id: u.user._id,
    name: u.user.name
  })));

  // Join general room
  socket.join('general');

  // Send message history
  try {
    const messages = await Message.find({ room: 'general' })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('sender', 'name')
      .populate('readBy', 'name');
    
    socket.emit('message:history', messages.reverse());
  } catch (error) {
    console.error('Error loading message history:', error);
  }

  // Handle new messages
  socket.on('message:send', async (data) => {
    try {
      const message = new Message({
        sender: socket.user._id,
        content: data.content,
        room: 'general',
        readBy: [socket.user._id]
      });
      
      await message.save();
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name')
        .populate('readBy', 'name');

      io.to('general').emit('message:receive', populatedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message:error', 'Failed to send message');
    }
  });

  // Handle typing status
  socket.on('typing:start', () => {
    socket.to('general').emit('typing:update', {
      userId: socket.user._id,
      name: socket.user.name,
      isTyping: true
    });
  });

  socket.on('typing:stop', () => {
    socket.to('general').emit('typing:update', {
      userId: socket.user._id,
      name: socket.user.name,
      isTyping: false
    });
  });

  // Handle message read status
  socket.on('message:read', async ({ messageId }) => {
    try {
      const message = await Message.findById(messageId);
      if (message && !message.readBy.includes(socket.user._id)) {
        message.readBy.push(socket.user._id);
        await message.save();
        io.to('general').emit('message:updated', {
          messageId,
          readBy: message.readBy
        });
      }
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.name);
    onlineUsers.delete(socket.user._id.toString());
    io.emit('users:online', Array.from(onlineUsers.values()).map(u => ({
      _id: u.user._id,
      name: u.user.name
    })));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});