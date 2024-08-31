import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_SOCKET_URI, {
  withCredentials: true,
});

export default socket;
