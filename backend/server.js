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
    origin: ['https://campaign-manager-frontend-8c0m.onrender.com', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Online users tracking
const onlineUsers = new Map();

// CORS configuration
app.use(cors({
  origin: ['https://campaign-manager-frontend-8c0m.onrender.com', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/events', require('./routes/events'));
app.use('/api/asana', require('./routes/asana'));
app.use('/api/social-media', require('./routes/socialMedia'));
app.use('/api/calendar', require('./routes/calendarRoutes'));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});