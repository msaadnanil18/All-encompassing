import { Server, Socket } from 'socket.io';
import { registerChatHandlers } from '../events/chatHandlers';

export const registerAllHandlers = (io: Server, socket: Socket) => {
  registerChatHandlers(io, socket);
};
