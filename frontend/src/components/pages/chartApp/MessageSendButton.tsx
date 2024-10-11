import React from 'react';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
const MessageSendButton = ({
  sendChatMessage,
}: {
  sendChatMessage: () => void;
}) => {
  return (
    <Button
      onClick={sendChatMessage}
      type="primary"
      shape="circle"
      icon={<SendOutlined />}
    />
  );
};

export default MessageSendButton;
