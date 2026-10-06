const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB, getMongoStatus } = require('./config/db');
const memoryStore = require('./utils/memoryStore');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const connectionRoutes = require('./routes/connections');
const messageRoutes = require('./routes/messages');
const sessionRoutes = require('./routes/sessions');
const groupRoutes = require('./routes/groups');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Socket.io Real-Time Event Handlers
io.on('connection', (socket) => {
  // Join user room for private messages & notifications
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
  });

  // Join group study room
  socket.on('join_group', (groupId) => {
    socket.join(`group_${groupId}`);
  });

  // Typing indicator
  socket.on('typing', ({ senderId, senderName, recipientId, groupId }) => {
    if (groupId) {
      socket.to(`group_${groupId}`).emit('user_typing', { senderId, senderName, groupId });
    } else if (recipientId) {
      socket.to(`user_${recipientId}`).emit('user_typing', { senderId, senderName });
    }
  });

  socket.on('stop_typing', ({ senderId, recipientId, groupId }) => {
    if (groupId) {
      socket.to(`group_${groupId}`).emit('user_stop_typing', { senderId, groupId });
    } else if (recipientId) {
      socket.to(`user_${recipientId}`).emit('user_stop_typing', { senderId });
    }
  });

  // Virtual study room interactions (shared notes sync, timer)
  socket.on('sync_notes', ({ roomId, notes, senderName }) => {
    socket.to(`room_${roomId}`).emit('notes_updated', { notes, senderName });
  });

  socket.on('join_study_room', (roomId) => {
    socket.join(`room_${roomId}`);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'VibeMates API',
    tagline: 'Learn Together. Grow Together.',
    mongoActive: getMongoStatus(),
    storageMode: getMongoStatus() ? 'MongoDB' : 'In-Memory Smart Engine',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static frontend build if deployed or built
const clientDistPath = path.join(__dirname, '../client/dist');
if (require('fs').existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  // Initialize memory store with demo data
  await memoryStore.init();

  // Connect MongoDB (with smooth fallback if absent)
  await connectDB();

  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 VibeMates Backend Server running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📡 Real-Time WebSockets: Active (Socket.io)`);
    console.log(`💾 Mode: ${getMongoStatus() ? 'MongoDB Active' : 'Smart In-Memory Store Active'}`);
    console.log(`======================================================\n`);
  });
};

startServer();

module.exports = { app, server };
