import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_SERVER_URI, {
  withCredentials: true,
  auth: {
    token: localStorage.getItem('token'),
  },
});

export default socket;
