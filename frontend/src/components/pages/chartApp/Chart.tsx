import { SmileOutlined } from '@ant-design/icons';
import MessageInput from './MessageInput';
import MessageSendButton from './MessageSendButton';
import { sendMessage } from '../../hooks/chart';
import { Button, Card } from 'antd';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import socket from '../../../helpers/socket';
import { ChatListItemInterface } from '../../types/charts';
import { useDarkMode } from '../../thems/useDarkMode';
import EmojiPiker from '../../emojiPicker/EmojiPiker';
import DriveFileUpload from '../../../driveFileUpload';
import { addFiles } from '../../types/addFiles';

const CONNECTED_EVENT = 'connected';
const DISCONNECT_EVENT = 'disconnect';
const JOIN_CHAT_EVENT = 'joinChat';
const NEW_CHAT_EVENT = 'newChat';

const Chart = ({
  id,
  userSeletedForChat,
}: {
  id: string | undefined;
  userSeletedForChat: ChatListItemInterface | null;
}) => {
  const isDark = useDarkMode();

  const [message, setMessage] = useState<string>('');
  const emojiToggleRef = useRef<{ toggle: () => void }>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selfTyping, setSelfTyping] = useState<boolean>(false);
  const currentChat = useRef<any>();
  const [attachments, setAttachments] = useState<addFiles[]>([]);

  const onConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const onNewChat = useCallback((chat: any) => {
    console.log(chat, 'chatss');

    setChats((prev) => [chat, ...prev]);
  }, []);

  const sendChatMessage = useCallback(async () => {
    if (!message.trim()) return;

    socket.emit(NEW_CHAT_EVENT, {
      content: message,
      chat: userSeletedForChat,
      attachments: attachments.map((file) => file.url),
    });

    try {
      const data = await sendMessage(
        id,
        message,
        attachments.map((file) => file.url)
      );
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [message, attachments, userSeletedForChat, id]);

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
    socket.emit(JOIN_CHAT_EVENT, id);
  }, [id]);

  useEffect(() => {
    if (id) {
      currentChat.current = id;
      socket.emit(JOIN_CHAT_EVENT, id);
      getMessages();
    }
  }, [id, getMessages]);

  useEffect(() => {
    const cleanup = connectSocket();
    return cleanup;
  }, [connectSocket]);

  const handleEmojiSelect = useCallback((event: React.MouseEvent) => {
    setMessage((prevMessage) => prevMessage + (event as any).emoji);
  }, []);

  const emojiPikerProps = useMemo(
    () => ({
      isDark,
      handleSelect: handleEmojiSelect,
      ref: emojiToggleRef,
    }),
    [isDark, handleEmojiSelect]
  );

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div style={{ height: '27rem' }}>
        <EmojiPiker {...emojiPikerProps} />
      </div>
      <div style={{ position: 'fixed', bottom: 0, width: '67%' }}>
        <Card
          style={{
            width: '100%',
            backgroundColor: isDark ? '#171717' : '#f0f2f5',
            marginBottom: 0,
          }}
        >
          <div className="flex items-center">
            <DriveFileUpload chooseFiles={(file) => setAttachments(file)} />
            <Button
              type="text"
              shape="circle"
              className="mr-1"
              icon={<SmileOutlined style={{ fontSize: '20px' }} />}
              onClick={() => {
                if (emojiToggleRef.current) {
                  emojiToggleRef.current.toggle();
                }
              }}
            />
            <MessageInput
              handleOnMessageChange={handleOnMessageChange}
              sendChatMessage={sendChatMessage}
              message={message}
            />
            <MessageSendButton
              message={message}
              sendChatMessage={sendChatMessage}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chart;
