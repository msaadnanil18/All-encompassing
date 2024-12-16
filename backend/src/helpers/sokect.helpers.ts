import { Server, Socket } from 'socket.io';

type EventHandlers = {
  [event: string]: (socket: Socket, ...args: any[]) => void;
};

class SocketServerHelper {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  registerHandlers(eventHandlers: EventHandlers): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      for (const [event, handler] of Object.entries(eventHandlers)) {
        socket.on(event, (...args) => handler(socket, ...args));
      }

      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
      });
    });
  }

  emitToSocket(socketId: string, event: string, data: any): void {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit(event, data);
    } else {
      console.error(`Socket with ID ${socketId} not found.`);
    }
  }

  broadcast(event: string, data: any): void {
    this.io.emit(event, data);
  }

  close(): void {
    this.io.close();
  }
}

export const createSocketServerHelper = (io: Server): SocketServerHelper => {
  return new SocketServerHelper(io);
};
