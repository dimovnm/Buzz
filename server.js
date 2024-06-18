const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const mongoUri = 'mongodb://localhost:27017/mydatabase';

// MongoDB connection
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware
app.use(express.static('public'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    console.log('Message received:', message);
    io.emit('message', message); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
