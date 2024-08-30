import { Server as HttpServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

export const setup_socket = (server: HttpServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: process.env.CROS_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('sendMessage', (message) => {
      console.log(`Message from ${socket.id}: ${message.senderId}`);
      io.emit('getMessage', message); // Broadcast to all connected clients
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
