import { SmileOutlined } from '@ant-design/icons';
import MessageInput from './MessageInput';
import MessageSendButton from './MessageSendButton';
import { sendMessage } from '../../hooks/chart';
import { Button } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
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
const Chart = ({ id }: { id: string | undefined }) => {
  const isDark = useDarkMode();

  const [message, setMessage] = useState<string>('');
  const emojiToggleRef = React.useRef<{ toggle: () => void }>(null);
  const [chats, setChats] = useState<ChatListItemInterface[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selfTyping, setSelfTyping] = useState<boolean>(false);
  const currentChat = React.useRef<any>();
  const [attachments, setAttachments] = useState<addFiles[]>([]);
  const onConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const sendChatMessage = useCallback(async () => {
    const data = await sendMessage(
      id,
      message,
      attachments.map((file) => file.url)
    );
    setMessage('');
    setAttachments([]);
    console.log(data, 'response');
  }, [message]);
  const handleOnMessageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setMessage(e.target.value);
      if (!isConnected) return;

      if (!selfTyping) {
        setSelfTyping(true);
      }
    },
    [isConnected, selfTyping]
  );

  const onNewChat = useCallback((chat: ChatListItemInterface) => {
    setChats((prev) => [chat, ...prev]);
  }, []);

  const connectSoket = useCallback(() => {
    socket.on(CONNECTED_EVENT, onConnect);
    socket.on(NEW_CHAT_EVENT, onNewChat);
    return () => {
      socket.off(CONNECTED_EVENT, onConnect);
      socket.off(NEW_CHAT_EVENT, onNewChat);
    };
  }, [onConnect, onNewChat]);

  const getMessages = () => {
    socket.emit(JOIN_CHAT_EVENT, id);
  };

  useEffect(() => {
    if (id) {
      currentChat.current = id;

      socket?.emit(JOIN_CHAT_EVENT, id);

      getMessages();
    }
  }, []);

  useEffect(() => {
    const cleanup = connectSoket();
    return cleanup;
  }, [connectSoket]);

  const handleEmojiSelect = useCallback((event: React.MouseEvent) => {
    setMessage((prevMessage) => prevMessage + (event as any).emoji);
  }, []);
  const emojiPikerProps = React.useMemo(
    () => ({
      isDark,
      handleSelect: handleEmojiSelect,
      ref: emojiToggleRef,
    }),
    [isDark, handleEmojiSelect]
  );

  return (
    <React.Fragment>
      <EmojiPiker {...emojiPikerProps} />
      <div
        className="fixed bottom-0 right-0 p-4 flex items-center"
        style={{
          width: '45rem',
          backgroundColor: isDark ? '#202c33' : '#f0f2f5',
          zIndex: 1000,
        }}
      >
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
          {...{
            handleOnMessageChange,
            sendChatMessage,
            message,
          }}
        />
        <MessageSendButton {...{ message, sendChatMessage }} />
      </div>
    </React.Fragment>
  );
};

export default React.memo(Chart);
