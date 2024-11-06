import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initializeSocket = useCallback(async () => {
    if (socket) return;

    const token = await AsyncStorage.getItem('token');
    if (token) {
      const newSocket = io(Config.REACT_NATIVE_SERVER_HOST, {
        withCredentials: true,
        auth: {
          token,
        },
      });
      setSocket(newSocket);
    }
  }, [socket]);

  useEffect(() => {
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [initializeSocket, socket]);

  return socket;
};
