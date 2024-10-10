import { SmileOutlined } from '@ant-design/icons';
import MessageInput from './MessageInput';
import MessageSendButton from './MessageSendButton';
import React, { Ref } from 'react';
import { Avatar, Button, Card, Empty, Input, Skeleton } from 'antd';
import { ChatMessageInterface } from '../../types/charts';
import { useDarkMode } from '../../thems/useDarkMode';
import EmojiPiker from '../../emojiPicker/EmojiPiker';
import DriveFileUpload from '../../../driveFileUpload';
import { addFiles } from '../../types/addFiles';
import Messages from './Messages';

interface ChartProps {
  chatLoading: boolean;
  emojiPikerProps: any;
  emojiToggleRef: Ref<{ toggle: () => void }>;
  handleOnMessageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  message: string;

  setAttachments: React.Dispatch<React.SetStateAction<addFiles[]>>;
  sendChatMessage: () => void;
  chats: ChatMessageInterface[];
  userId: string | undefined;
}

const Chats = ({
  handleOnMessageChange,
  emojiPikerProps,
  emojiToggleRef,
  message,
  setAttachments,
  sendChatMessage,
  chats,
  userId,
  chatLoading,
}: ChartProps) => {
  const isDark = useDarkMode();

  return (
    <div className="relative flex flex-col">
      {!chats.length ? (
        <div className=" grid place-content-center mt-36">
          <Empty description="No chats please select user" />
        </div>
      ) : chatLoading ? (
        Array.from({ length: 20 }, (_, i) => i).map((_, i) => (
          <Card
            bordered={false}
            size="small"
            key={i}
            style={{
              alignSelf: 'flex-end',
              width: 100,
              height: 50,
              backgroundColor: isDark ? '#141414' : '#f0f2f5',
              color: 'black',
              borderRadius: '5px',
              padding: '0.5rem',
              margin: '10px',
            }}
            loading={true}
          />
        ))
      ) : (
        (chats || []).map((chat) => (
          <Messages {...{ chat, userId, isDark }} key={chat._id} />
        ))
      )}

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

export default Chats;
