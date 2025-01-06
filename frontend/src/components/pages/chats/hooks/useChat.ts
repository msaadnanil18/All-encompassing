import { Form, notification } from 'antd';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { User } from '../../../types/partialUser';
import { getSocketHelper } from '../../../../helpers/socket.helper';
import { Chatevent } from '../constant';
import { ChatListItem } from '../types';
import { ServiceErrorManager } from '../../../../helpers/service';
import {
  ArchivedChatService,
  ChatListService,
  UnArchivedChatService,
} from '../service';
import { getUploadFile } from '../../../../driveFileUpload/getUploadFile';
import { useRecoilValue } from 'recoil';
import { $ME } from '../../../atoms/root';
import dayjs from 'dayjs';

const useChat = () => {
  const me = useRecoilValue($ME);
  const socket = getSocketHelper();
  const [chatForm] = Form.useForm();
  const [openDrawe, setOpenDrawer] = useState<boolean>(false);
  const [isGroupChatCrate, setIsGroupChatCrate] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [chatListLoding, setChatListLoding] = useState<boolean>(false);
  const [chatList, setChatList] = useState<Array<ChatListItem>>([]);

  const fetchChatList = useCallback(async () => {
    setChatListLoding(true);
    const [err, data] = await ServiceErrorManager(ChatListService(), {
      failureMessage: 'Error while featcing chat list',
    });
    if (err || !data) return;

    setChatList(data.docs);
    setChatListLoding(false);
  }, []);

  useEffect(() => {
    fetchChatList().catch(console.log);
  }, []);

  const onRealtimeChat = useCallback((newChat: ChatListItem) => {
    if (newChat) {
      setChatList((prevChat) => {
        const existingIndex = prevChat.findIndex(
          (existingChat) => existingChat._id === newChat._id
        );

        if (existingIndex !== -1) {
          const updatedChats = [...prevChat];
          updatedChats[existingIndex] = newChat;
          return updatedChats;
        }
        return [...prevChat, newChat];
      });
    }
  }, []);

  const onRealtimeGroupChat = useCallback(
    async (newGroupChat: ChatListItem) => {
      if (newGroupChat) {
        setChatList((prevChat) => {
          const existingIndex = prevChat.findIndex(
            (existingChat) => existingChat._id === newGroupChat._id
          );

          if (existingIndex !== -1) {
            const updatedChats = [...prevChat];
            updatedChats[existingIndex] = newGroupChat;
            return updatedChats;
          }
          notification.success({
            message: 'Success',
            description: `Welcome to ${newGroupChat.name} group`,
          });
          return [...prevChat, newGroupChat];
        });
      }
    },
    []
  );
  const onlineUsers = useCallback(
    (value: { user: User; isOnline: boolean }) => {
      setChatList((prevChatList) =>
        prevChatList.map((chat) => ({
          ...chat,
          members: chat.members.map((member) => {
            if (member._id.toString() === value?.user?._id.toString()) {
              return {
                ...member,
                status: {
                  ...(member as any).status,
                  isOnline: value.isOnline,
                  user: value.user,
                },
              };
            }

            return member;
          }),
        }))
      );
    },
    []
  );

  const onRealTimeListen = useCallback(() => {
    socket.on(Chatevent.CHAT_CREATE_CHAT, onRealtimeChat);
    socket.on(Chatevent.CHAT_CREATE_GROUP_CHAT, onRealtimeGroupChat);
    socket.on(Chatevent.ONLINE_USERS_UPDATE, onlineUsers);

    return () => {
      socket.off(Chatevent.CHAT_CREATE_CHAT, onRealtimeChat);
      socket.off(Chatevent.CHAT_CREATE_GROUP_CHAT, onRealtimeGroupChat);
      socket.off(Chatevent.ONLINE_USERS_UPDATE, onlineUsers);
    };
  }, []);

  useEffect(() => {
    socket.emit(Chatevent.ONLINE_USERS_UPDATE, { userId: me?._id });
    const cleanUp = onRealTimeListen();

    return () => {
      cleanUp;
    };
  }, [onRealTimeListen]);

  const createChat = useCallback(async (value: User) => {
    setSubmitLoading(true);
    socket.emit(Chatevent.CHAT_CREATE_CHAT, { ...value });
    setOpenDrawer(false);
    setSubmitLoading(false);
    chatForm.resetFields();
    setIsGroupChatCrate(false);
  }, []);

  const createGroupChat = useCallback(async () => {
    setSubmitLoading(true);
    try {
      await chatForm.validateFields();
      const value = chatForm.getFieldsValue();
      let file = null;
      if (value.groupAvatar) {
        file = await getUploadFile({
          file: value.groupAvatar,
          uploadType: 'cloud2',
        });
      }

      socket.emit(Chatevent.CHAT_CREATE_GROUP_CHAT, {
        groupAvatar: file?.[0]?.url || null,
        name: value.name,
        members: value.members,
      });

      setOpenDrawer(false);
      setSubmitLoading(false);
      chatForm.resetFields();
      setIsGroupChatCrate(false);
    } catch (error) {
      notification.error({
        message: 'Error while creating group please try again',
      });
      console.error(error);
    } finally {
      setOpenDrawer(false);
      setSubmitLoading(false);
      chatForm.resetFields();
      setIsGroupChatCrate(false);
    }
  }, []);

  const hendelOnArchive = useCallback(
    async (chatId?: string) => {
      if (!chatId) return;

      const archiveEntry = {
        user: me || undefined,
        archivedAt: dayjs().toISOString(),
      };

      setChatList((prevChat) => {
        return prevChat.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                archivedBy: [...(chat.archivedBy || []), archiveEntry],
              }
            : chat
        );
      });

      await ServiceErrorManager(
        ArchivedChatService({
          data: {
            usePayloadUpdate: true,
            query: { _id: chatId },
            payload: {
              $push: { archivedBy: archiveEntry },
            },
          },
        }),
        {
          failureMessage: 'Error while archiving chat',
        }
      );
    },
    [chatList, me]
  );

  const handelOnUnArchive = useCallback(
    async (chatId?: string) => {
      if (!chatId) return;

      setChatList((prevChat) => {
        const updatedChats = prevChat.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                archivedBy: chat.archivedBy?.filter(
                  (arch) => arch.user?._id !== me?._id
                ),
              }
            : chat
        );
        return updatedChats;
      });

      if (me?._id) {
        await ServiceErrorManager(
          UnArchivedChatService({
            data: {
              usePayloadUpdate: true,
              query: { _id: chatId },
              payload: { $pull: { archivedBy: { user: me._id } } },
            },
          }),
          {
            failureMessage: 'Error while unarchiving chat',
          }
        );
      }
    },
    [chatList, me]
  );

  const state = useMemo(
    () => ({
      openDrawe,
      isGroupChatCrate,
      submitLoading,
      chatListLoding,
      chatList,
    }),
    [openDrawe, isGroupChatCrate, submitLoading, chatListLoding, chatList]
  );

  const action = useMemo(
    () => ({
      chatForm,
      setOpenDrawer,
      setIsGroupChatCrate,
      onSelectUser: createChat,
      createGroupChat,
      hendelOnArchive,
      handelOnUnArchive,
    }),
    [
      chatForm,
      createChat,
      createGroupChat,
      setOpenDrawer,
      setIsGroupChatCrate,
      hendelOnArchive,
      handelOnUnArchive,
    ]
  );

  return {
    state,
    action,
  };
};

export default useChat;
