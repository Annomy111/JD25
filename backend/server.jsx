import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import Message from './models/Message.jsx';
import User from './models/User.jsx';

const app = express();
const server = createServer(app);
const io = new Server(server, {
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
import authRoutes from './routes/auth.jsx';
import volunteersRoutes from './routes/volunteers.jsx';
import eventsRoutes from './routes/events.jsx';
import asanaRoutes from './routes/asana.jsx';
import socialMediaRoutes from './routes/socialMedia.jsx';
import calendarRoutes from './routes/calendarRoutes.jsx';
import canvassingRoutes from './routes/canvassing.jsx';

app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/asana', asanaRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/canvassing', canvassingRoutes);

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
  
  onlineUsers.set(socket.user._id.toString(), {
    socketId: socket.id,
    user: socket.user
  });
  
  io.emit('users:online', Array.from(onlineUsers.values()).map(u => ({
    _id: u.user._id,
    name: u.user.name
  })));

  socket.on('canvassing:update', async (data) => {
    try {
      io.emit('canvassing:updated', {
        districtId: data.districtId,
        progress: data.progress,
        visitedHouseholds: data.visitedHouseholds
      });
    } catch (error) {
      console.error('Error in canvassing update:', error);
    }
  });

  socket.on('message:send', async (data) => {
    try {
      const message = new Message({
        sender: socket.user._id,
        content: data.content,
        chatId: data.chatId
      });
      await message.save();
      
      io.emit('message:received', {
        ...message.toObject(),
        sender: {
          _id: socket.user._id,
          name: socket.user.name
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

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