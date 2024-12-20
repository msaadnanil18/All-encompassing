import { ServiceErrorManager } from '@AllEcompassing/helpers/service';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { MessageListService } from '../service';
import { useSocket } from '@AllEcompassing/helpers/socket';
import { ChatMessageInterface } from '../types';
import useChats from './useChats';
import { generateMessageId } from '@AllEcompassing/utils';

const CONNECTED_EVENT = 'connected';
const DISCONNECT_EVENT = 'disconnect';
const JOIN_CHAT_EVENT = 'joinChat';
const NEW_CHAT_EVENT = 'newChat';

const useMessage = ({
  chatId,
  userId,
  onClearMessage,
}: {
  chatId: string;
  userId: string | undefined;
  onClearMessage: () => void;
}) => {
  const socket = useSocket();
  const [chats, setChats] = useState<ChatMessageInterface[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const {
    states: { chatList },
  } = useChats({ userId: userId as string });
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const fetchMessageList = async () => {
    if (chatLoading || !hasMore) return;
    setChatLoading(true);
    ServiceErrorManager(
      MessageListService({
        data: {
          query: {
            chat: chatId,
          },
          options: {
            sort: { createdAt: -1 },
            limit: 20,
            page: page,
          },
        },
      }),
      { failureMessage: 'Error while fetch user for chat' },
    )
      .then(([_, data]) => {
        if (data?.docs?.length) {
          setChats((prev) => [...prev, ...data.docs]);
        }

        if (!data.nextPage) {
          setHasMore(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setChatLoading(false));
  };

  const loadMessages = useCallback(async () => {
    if (chatLoading || !hasMore) return;
    await fetchMessageList();
  }, [chatLoading, hasMore, fetchMessageList]);

  useEffect(() => {
    loadMessages();
  }, [chatId, page]);

  const handelOnSendMessage = (message: string) => {
    if (message.trim() === '') return;
    const _id = generateMessageId();

    if (socket) {
      socket?.emit(NEW_CHAT_EVENT, {
        messageId: _id,
        content: message,
        chat: chatList.find((chats) => chats._id === chatId),
        attachments: [],
      });
    }

    setChats((prev) => [
      {
        _id: _id,
        sender: userId,
        content: message,
        attachments: [],
      },
      ...prev,
    ]);
    onClearMessage();
  };

  const handelOnConnect = useCallback(() => {
    setIsSocketConnected(true);
  }, []);

  const handelOnNewChat = useCallback((chat: any) => {
    if (chatId === chat.message.chat) {
      setChats((prev) =>
        prev.some((existingChat) => existingChat._id === chat.message._id)
          ? prev.map((existingChat) =>
              existingChat._id === chat.message._id
                ? chat.message
                : existingChat,
            )
          : [chat.message, ...prev],
      );
    }
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

      hasMore,
    }),
    [chats, chatLoading, hasMore],
  );

  const actons = useMemo(
    () => ({
      handelOnSendMessage,
      setPage,
    }),
    [handelOnSendMessage, setPage],
  );
  return { states, actons };
};

export default useMessage;
