import { SendOutlined, SmileOutlined } from '@ant-design/icons';
import MessageInput from './MessageInput';
import MessageSendButton from './MessageSendButton';
import React, { Ref } from 'react';
import { Button, Card, Input } from 'antd';
import {
  ChatListItemInterface,
  ChatMessageInterface,
} from '../../types/charts';
import { useDarkMode } from '../../thems/useDarkMode';
import EmojiPiker from '../../emojiPicker/EmojiPiker';
import DriveFileUpload from '../../../driveFileUpload';
import { addFiles } from '../../types/addFiles';
import dayjs from 'dayjs';

interface ChartProps {
  emojiPikerProps: any;
  emojiToggleRef: Ref<{ toggle: () => void }>;
  handleOnMessageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setAttachments: React.Dispatch<React.SetStateAction<addFiles[]>>;
  sendChatMessage: () => void;
  chats: ChatMessageInterface[];
  userId: string | undefined;
}

const Chart = ({
  handleOnMessageChange,
  emojiPikerProps,
  emojiToggleRef,
  message,
  setMessage,
  setAttachments,
  sendChatMessage,
  chats,
  userId,
}: ChartProps) => {
  const isDark = useDarkMode();

  console.log(chats);

  return (
    <div className="relative h-screen flex flex-col">
      <div
        className="flex-1 p-4  overflow-y-scroll"
        style={{
          backgroundColor: isDark ? '#1f1f1f' : '#e5ddd5',
          width: '56rem',
        }}
      >
        {(chats || []).map((msg, index: number) => {
          const isMyMessage = msg.sender === userId;
          return (
            <div
              key={index}
              className={`p-3 rounded-lg shadow-md max-w-xs mb-3 ${
                isMyMessage ? 'ml-auto bg-green-200' : 'mr-auto bg-white'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <small
                className={`block text-xs mt-1 ${
                  isMyMessage
                    ? 'text-right text-blue-500'
                    : 'text-left text-gray-500'
                }`}
              >
                {dayjs(msg.updatedAt).format('DD/MM/YYYY HH:mm')}
              </small>
            </div>
          );
        })}
      </div>

      <div style={{ height: '20rem' }}>
        <EmojiPiker {...emojiPikerProps} />
      </div>

      <div className="fixed bottom-0" style={{ width: '67%' }}>
        <Card
          style={{
            backgroundColor: isDark ? '#171717' : '#f0f2f5',
            width: '100%',
          }}
        >
          <div className="flex items-center space-x-3">
            <DriveFileUpload chooseFiles={(file) => setAttachments(file)} />

            <Button
              type="text"
              shape="circle"
              icon={<SmileOutlined style={{ fontSize: '20px' }} />}
              onClick={() => {
                if ((emojiToggleRef as any).current) {
                  (emojiToggleRef as any).current.toggle();
                }
              }}
            />

            <MessageInput
              handleOnMessageChange={(e) => {
                setMessage(e.target.value);
                handleOnMessageChange(e);
              }}
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
