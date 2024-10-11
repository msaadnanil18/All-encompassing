import React from 'react';
import { Input } from 'antd';

const MessageInput = ({
  value,
  onChange,
  send,
}: {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  send: () => void;
}) => {
  return (
    <Input
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          send();
        }
      }}
      className="flex-grow mr-2"
      style={{ padding: '8px', borderRadius: '9px' }}
    />
  );
};

export default MessageInput;
