import { io, Socket } from 'socket.io-client';

class SocketHelper {
  private socket: Socket;

  constructor(serverUrl: string, options = {}) {
    this.socket = io(serverUrl, options);
  }

  emit<T>(event: string, data: T): void {
    this.socket.emit(event, data);
  }

  on<T>(event: string, callback: (data: T) => void): void {
    this.socket.on(event, callback);
  }

  off<T>(event: string, callback: (data: T) => void): void {
    this.socket.off(event, callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  reconnect(): void {
    this.socket.connect();
  }
}

let socketHelper: SocketHelper;

export const initSocketHelper = (
  serverUrl: string,
  options = {}
): SocketHelper => {
  if (!socketHelper) {
    socketHelper = new SocketHelper(serverUrl, options);
  }
  return socketHelper;
};

export const getSocketHelper = (): SocketHelper => {
  if (!socketHelper) {
    throw new Error(
      'SocketHelper is not initialized. Call initSocketHelper first.'
    );
  }
  return socketHelper;
};
