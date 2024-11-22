import { AutoCompleteProps, Form, Select } from 'antd';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTogglers } from '../../../hooks/togglers';
import { ServiceErrorManager } from '../../../../helpers/service';
import { SearchService } from '../../../services/Search';
import { User } from '../../../types/partialUser';
import { RenderItem } from '../UserListHeader';
import { useInfiniteScrollTop } from '6pp';
import {
  CreateChatsService,
  ChatListService,
  MessageListService,
} from '../../../services/chart';

import {
  ChatListItemInterface,
  ChatMessageInterface,
} from '../../../types/charts';
import { debounce } from 'lodash-es';
import { addFiles } from '../../../types/addFiles';
import { useDarkMode } from '../../../thems/useDarkMode';
import socket from '../../../../helpers/socket';
import { sendMessage } from '../../../hooks/chart';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { generateMessageId } from '../../../utills';

const CONNECTED_EVENT = 'connected';
const DISCONNECT_EVENT = 'disconnect';
const JOIN_CHAT_EVENT = 'joinChat';
const NEW_CHAT_EVENT = 'newChat';
const DELETE_MESSAGE_EVENT = 'deleteMessage';

const useChats = ({ userId }: { userId: string | undefined }) => {
  const [searchOptions, setSearchOptions] = useState<
    AutoCompleteProps['options']
  >([]);
  let [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const isDark = useDarkMode();
  const currentChat = useRef<any>();
  const containerRef = useRef<React.MutableRefObject<HTMLElement | null>>(null);
  const [chatsDocs, setChatsDocs] = useState<any>();
  const emojiToggleRef = useRef<{ toggle: () => void }>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<User[]>([]);
  const [chatList, setChatList] = useState<ChatListItemInterface[]>([]);
  const [chatListLoading, setChatListLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selfTyping, setSelfTyping] = useState<boolean>(false);
  // const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<ChatMessageInterface[]>([]);
  const [attachments, setAttachments] = useState<addFiles[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [messageEditId, setMessageEditId] = useState<string | null>(null);
  const [messageDeleteId, setMessageDeleteId] = useState<string | null>(null);
  const {
    open: openSearchBar,
    close: closeSearchBar,
    state: isOpenSearchBar,
  } = useTogglers(false);

  const handelOnSearchChange = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 15),
    []
  );

  //@ts-ignore
  useInfiniteScrollTop(containerRef, chatsDocs?.totalPages, page, setPage);
  const fetchMessageList = () => {
    setChatLoading(true);
    ServiceErrorManager(
      MessageListService({
        data: {
          query: {
            chat: searchParams.get('id'),
          },
          options: {
            // sort: { createdAt: -1 },
            limit: 1000,
            // page: page,
          },
        },
      }),
      { failureMessage: 'Error while fetch user for chat' }
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
  }, [searchParams.get('id')]);

  const fetchSearchResults = useCallback(async () => {
    const [err, data] = await ServiceErrorManager(
      SearchService({
        data: {
          options: {
            select: '-themConfig -password -refreshToken',
          },
          query: {
            _id: { $ne: userId },
            isVerified: { $ne: false },
            search: searchTerm,
            searchFields: ['name'],
          },
        },
      }),
      {}
    );
    if (err) return;
    setSearchData(data?.docs || []);
    setSearchOptions(
      (data?.docs || []).map((d: User, index: number) => ({
        label: <RenderItem resource={d} index={index} />,
        value: (d?._id || '') as string,
      }))
    );
  }, [searchTerm]);

  useEffect(() => {
    fetchSearchResults();
  }, [searchTerm]);

  useEffect(() => {
    if (selectedUser) {
      const matchedUser = searchData.find((user) => user._id === selectedUser);
      setSearchTerm(matchedUser?.name || '');
    }
  }, [selectedUser]);
  const handelOnCreateChatSelect = useCallback(
    async (value: string) => {
      setSelectedUser(value);
      closeSearchBar();

      const [err, data] = await ServiceErrorManager(
        CreateChatsService({
          data: {
            payload: { receiver: value },
          },
        }),
        { failureMessage: 'Error while user not listed' }
      );

      setSearchTerm('');
      fetchChatList();
    },
    [closeSearchBar]
  );

  const fetchChatList = useCallback(async () => {
    setChatListLoading(true);
    const [err, data] = await ServiceErrorManager(
      ChatListService({
        data: {
          payload: {},
          options: {
            sort: { updatedAt: -1 },
            populate: [
              {
                path: 'members',

                select: '-themConfig -refreshToken -password',
              },
              // {
              //   path: 'creator',
              //   match: { name: 'pintu' },
              // },
            ],
          },
          query: { members: userId },
        },
      }),
      { failureMessage: 'Error while featcing chat list' }
    );
    setChatListLoading(false);
    if (err) return;

    setChatList(data.docs);
  }, []);

  useEffect(() => {
    fetchChatList().catch(console.log);
  }, []);

  const onConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const onNewChat = useCallback((chat: any) => {
    setChats((prev) =>
      prev.some((existingChat) => existingChat._id === chat.message._id)
        ? prev.map((existingChat) =>
            existingChat._id === chat.message._id ? chat.message : existingChat
          )
        : [...prev, chat.message]
    );
  }, []);

  const sendChatMessage = useCallback(async () => {
    const _id = generateMessageId();
    await form.validateFields();
    const _message = form.getFieldValue('message');

    if (_message.trim() === '') return;

    socket.emit(NEW_CHAT_EVENT, {
      messageId: _id,
      ...(messageEditId ? { messageEditId } : {}),
      content: _message,
      chat: chatList.find((chats) => chats._id === searchParams.get('id')),
      attachments: attachments.map((file) => file.url),
    });

    const newChat = {
      _id: messageEditId || _id,
      sender: userId,
      content: _message,
      attachments: attachments.map((file) => ({
        url: file.url,
      })),
    };

    setChats((prev) =>
      prev.some((existingChat) => existingChat._id === messageEditId)
        ? prev.map((existingChat) =>
            existingChat._id === messageEditId ? newChat : existingChat
          )
        : [...prev, newChat]
    );
    form.resetFields();
    setMessageEditId(null);
  }, [attachments, searchParams.get('id'), userId, messageEditId, chatList]);

  const connectSocket = useCallback(() => {
    if (socket) {
      socket.on(CONNECTED_EVENT, onConnect);
      socket.on(NEW_CHAT_EVENT, onNewChat);
      socket.on(DELETE_MESSAGE_EVENT, ({ deleteMessageId }) =>
        setChats((prev) => prev.filter((chat) => chat._id !== deleteMessageId))
      );
    }

    return () => {
      if (socket) {
        socket.off(CONNECTED_EVENT, onConnect);
        socket.off(NEW_CHAT_EVENT, onNewChat);
        socket.off(DELETE_MESSAGE_EVENT, (e) => console.log(e, 'edeelllee'));
      }
    };
  }, [onConnect, onNewChat]);

  const getMessages = useCallback(() => {
    socket.emit(JOIN_CHAT_EVENT, userId);
  }, [userId]);

  useEffect(() => {
    if (userId) {
      currentChat.current = userId;
      socket.emit(JOIN_CHAT_EVENT, userId);
      getMessages();
    }
  }, [userId, getMessages]);

  useEffect(() => {
    const cleanup = connectSocket();
    return cleanup;
  }, [connectSocket]);

  const handleEmojiSelect = useCallback((event: React.MouseEvent) => {
    const selectedEmoji = (event as any).emoji;
    const _message = form.getFieldValue('message');
    form.setFieldValue('message', _message + selectedEmoji);
    // setMessage((prevMessage) => prevMessage + selectedEmoji);
  }, []);

  const emojiPikerProps = useMemo(
    () => ({
      isDark,
      handleSelect: handleEmojiSelect,
      ref: emojiToggleRef,
    }),
    [isDark, handleEmojiSelect]
  );

  const handelOnDeleteMessage = useCallback(
    async function (r: ChatMessageInterface | null) {
      setChats((prev) => prev.filter((chat) => chat._id !== r?._id));

      socket.emit(DELETE_MESSAGE_EVENT, {
        deleteMessageId: r?._id,
        chat: chatList.find((chats) => chats._id === searchParams.get('id')),
      });
    },
    [searchParams.get('id'), chatList]
  );

  const togglers = useMemo(
    () => ({
      selectUserToChat: { openSearchBar, closeSearchBar, isOpenSearchBar },
    }),
    [openSearchBar, closeSearchBar, isOpenSearchBar]
  );

  const handleOnMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // setMessage(e.target.value);

      if (!isConnected) return;

      if (!selfTyping) {
        setSelfTyping(true);
      }
    },
    [isConnected, selfTyping]
  );

  const actions = useMemo(
    () => ({
      handelOnSearchChange,
      handelOnCreateChatSelect,
      handleOnMessageChange,
      emojiPikerProps,
      emojiToggleRef,
      sendChatMessage,
      setAttachments,
      setMessageEditId,
      handelOnDeleteMessage,

      form,
    }),
    [
      handelOnSearchChange,
      handelOnCreateChatSelect,
      handleOnMessageChange,
      emojiPikerProps,
      emojiToggleRef,
      sendChatMessage,
      setAttachments,
      setMessageEditId,
      handelOnDeleteMessage,
      form,
    ]
  );

  const states = useMemo(
    () => ({
      searchOptions,
      searchTerm,
      chatList,
      chatListLoading,
      chats,
      chatLoading,
      containerRef,
    }),
    [
      searchOptions,
      searchTerm,
      chatListLoading,
      chatList,
      chats,
      chatLoading,
      containerRef,
    ]
  );
  return { togglers, actions, states };
};
export default useChats;
