import { Form, notification } from 'antd';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { User } from '../../../types/partialUser';
import { getSocketHelper } from '../../../../helpers/socket.helper';
import { Chatevent } from '../constant';
import { ChatListItem } from '../types';
import { ServiceErrorManager } from '../../../../helpers/service';
import { ChatListService } from '../service';
import { getUploadFile } from '../../../../driveFileUpload/getUploadFile';

const useChat = () => {
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
      console.log(newGroupChat, 'newGroupChat');
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
  const onlineUsers = useCallback((value) => {
    console.log(value, 'values_onLine_');
  }, []);

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
    const cleanUp = onRealTimeListen();
    return cleanUp;
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
    console.log(file, 'files');
    console.log(value, 'value');
    setOpenDrawer(false);
    setSubmitLoading(false);
    chatForm.resetFields();
    setIsGroupChatCrate(false);
  }, []);

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
    }),
    [chatForm, createChat, createGroupChat, setOpenDrawer, setIsGroupChatCrate]
  );

  return {
    state,
    action,
  };
};

export default useChat;
