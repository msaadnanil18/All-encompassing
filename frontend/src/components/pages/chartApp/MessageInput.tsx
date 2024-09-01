import React from 'react';
import { Input } from 'antd';

const MessageInput = ({
  message,
  handleOnMessageChange,
  sendChatMessage,
}: {
  message: string;
  handleOnMessageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  sendChatMessage: () => void;
}) => {
  return (
    <Input
      value={message}
      onChange={handleOnMessageChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendChatMessage();
        }
      }}
      className="flex-grow mr-2"
      style={{ padding: '8px', borderRadius: '9px' }}
    />
  );
};

export default MessageInput;
