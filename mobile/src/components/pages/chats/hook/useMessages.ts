import { ServiceErrorManager } from '@AllEcompassing/helpers/service';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { MessageListService } from '../service';
import { useSocket } from '@AllEcompassing/helpers/socket';
import { ChatMessageInterface } from '../types';
import useChats from './useChats';

const CONNECTED_EVENT = 'connected';
const DISCONNECT_EVENT = 'disconnect';
const JOIN_CHAT_EVENT = 'joinChat';
const NEW_CHAT_EVENT = 'newChat';

const useMessage = ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string | undefined;
}) => {
  const socket = useSocket();

  const [chatsDocs, setChatsDocs] = useState<any>();
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<ChatMessageInterface[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const {
    states: { chatList },
  } = useChats({ userId: userId as string });
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const fetchMessageList = () => {
    setChatLoading(true);
    ServiceErrorManager(
      MessageListService({
        data: {
          query: {
            chat: chatId,
          },
          options: {
            sort: { createdAt: -1 },
            limit: 1000,
            // page: page,
          },
        },
      }),
      { failureMessage: 'Error while fetch user for chat' },
    )
      .then(([_, data]) => {
        setChats(data?.docs);
        // if (data.totalPages > 1) {
        //   setChats((prevChats) => [...data.docs, ...(prevChats || [])]);
        // } else {
        //   setChats(data?.docs);
        // }

        setChatsDocs(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setChatLoading(false));
  };

  useEffect(() => {
    fetchMessageList();
  }, [chatId]);

  const handelOnSendMessage = useCallback(() => {
    if (message.trim() === '') return;

    if (socket) {
      socket?.emit(NEW_CHAT_EVENT, {
        content: message,
        chat: chatList.find((chats) => chats._id === chatId),
        attachments: [],
      });
    }

    setChats((prev) => [
      {
        _id: Math.random().toFixed(10).replace('0.', '').toString(),
        sender: userId,
        content: message,
        attachments: [],
      },
      ...prev,
    ]);
    setMessage('');
  }, [message, userId]);

  const handelOnConnect = useCallback(() => {
    setIsSocketConnected(true);
  }, []);
  const handelOnNewChat = useCallback((chat: any) => {
    setChats((prev) => [chat.message, ...prev]);
  }, []);

  const connectSocket = useCallback(() => {
    if (socket) {
      socket.on(CONNECTED_EVENT, handelOnConnect);
      socket.on(NEW_CHAT_EVENT, handelOnNewChat);
    }
    return () => {
      if (socket) {
        socket.off(CONNECTED_EVENT, handelOnConnect);
        socket.off(NEW_CHAT_EVENT, handelOnNewChat);
      }
    };
  }, [socket, handelOnConnect, handelOnNewChat]);

  useEffect(() => {
    const cleanUp = connectSocket();
    return cleanUp;
  }, [connectSocket]);

  const states = useMemo(
    () => ({
      chats,
      chatLoading,
      message,
    }),
    [chats, chatLoading, message],
  );

  const actons = useMemo(
    () => ({
      setMessage,
      handelOnSendMessage,
    }),
    [setMessage, handelOnSendMessage],
  );
  return { states, actons };
};

export default useMessage;
