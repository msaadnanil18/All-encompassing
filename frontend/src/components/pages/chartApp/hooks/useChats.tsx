import { AutoCompleteProps, Select } from 'antd';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTogglers } from '../../../hooks/togglers';
import { ServiceErrorManager } from '../../../../helpers/service';
import { SearchService } from '../../../services/Search';
import { User } from '../../../types/partialUser';
import { RenderItem } from '../UserListHeader';
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
const CONNECTED_EVENT = 'connected';
const DISCONNECT_EVENT = 'disconnect';
const JOIN_CHAT_EVENT = 'joinChat';
const NEW_CHAT_EVENT = 'newChat';

const useChats = ({ userId }: { userId: string | undefined }) => {
  const [searchOptions, setSearchOptions] = useState<
    AutoCompleteProps['options']
  >([]);
  let [searchParams] = useSearchParams();

  const isDark = useDarkMode();
  const currentChat = useRef<any>();
  const emojiToggleRef = useRef<{ toggle: () => void }>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<User[]>([]);
  const [chatList, setChatList] = useState<ChatListItemInterface[]>([]);
  const [chatListLoading, setChatListLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selfTyping, setSelfTyping] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [chats, setChats] = useState<ChatMessageInterface[]>([]);
  const [attachments, setAttachments] = useState<addFiles[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const {
    open: openSearchBar,
    close: closeSearchBar,
    state: isOpenSearchBar,
  } = useTogglers(false);

  const handelOnSearchChange = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 1500),
    []
  );

  const fetchMessageList = async () => {
    setChatLoading(true);
    ServiceErrorManager(
      MessageListService({
        data: {
          query: {
            chat: searchParams.get('id'),
          },
          options: {
            limit: 1000,
          },
        },
      }),
      { failureMessage: 'Error while fetch user for chat' }
    )
      .then(([_, data]) => setChats(data?.docs))
      .catch((err) => console.log(err))
      .finally(() => setChatLoading(false));
  };

  useEffect(() => {
    fetchMessageList().catch(console.log);
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
    setChats((prev) => [...prev, chat.message]);
  }, []);

  const sendChatMessage = useCallback(async () => {
    if (!message.trim()) return;

    socket.emit(NEW_CHAT_EVENT, {
      content: message,
      chat: chatList.find((chats) => chats._id === searchParams.get('id')),
      attachments: attachments.map((file) => file.url),
    });

    setChats((prev) => [
      ...prev,
      {
        sender: userId,
        content: message,
        attachments: attachments.map((file) => ({
          url: file.url,
        })),
      },
    ]);

    try {
      const data = await sendMessage(
        userId,
        message,
        attachments.map((file) => file.url)
      );
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [message, attachments, searchParams.get('id'), userId]);

  const connectSocket = useCallback(() => {
    if (socket) {
      socket.on(CONNECTED_EVENT, onConnect);
      socket.on(NEW_CHAT_EVENT, onNewChat);
    }

    return () => {
      if (socket) {
        socket.off(CONNECTED_EVENT, onConnect);
        socket.off(NEW_CHAT_EVENT, onNewChat);
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

    setMessage((prevMessage) => prevMessage + selectedEmoji);
  }, []);

  const emojiPikerProps = useMemo(
    () => ({
      isDark,
      handleSelect: handleEmojiSelect,
      ref: emojiToggleRef,
    }),
    [isDark, handleEmojiSelect]
  );

  const handleOnMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMessage(e.target.value);

      if (!isConnected) return;

      if (!selfTyping) {
        setSelfTyping(true);
      }
    },
    [isConnected, selfTyping]
  );

  const togglers = useMemo(
    () => ({
      selectUserToChat: { openSearchBar, closeSearchBar, isOpenSearchBar },
    }),
    [openSearchBar, closeSearchBar, isOpenSearchBar]
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
    }),
    [
      handelOnSearchChange,
      handelOnCreateChatSelect,
      handleOnMessageChange,
      emojiPikerProps,
      emojiToggleRef,
      sendChatMessage,
      setAttachments,
    ]
  );

  const states = useMemo(
    () => ({
      searchOptions,
      searchTerm,
      chatList,
      chatListLoading,
      message,
      chats,
      chatLoading,
    }),
    [
      searchOptions,
      searchTerm,
      chatListLoading,
      chatList,
      message,
      chats,
      chatLoading,
    ]
  );
  return { togglers, actions, states };
};
export default useChats;
