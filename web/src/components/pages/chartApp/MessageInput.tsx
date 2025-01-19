import React, { FC, useState } from 'react';
import { Form, FormInstance, Input } from 'antd';
import MessageSendButton from './MessageSendButton';

const MessageInput: FC<{
  form: FormInstance;
  sendChatMessage: () => void;
}> = ({ form, sendChatMessage }) => {
  const [message, setMessage] = useState<string>();

  return (
    <>
      <Form form={form} style={{ width: '100%' }}>
        <Form.Item name='message' noStyle>
          <Input
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendChatMessage();
              }
            }}
            className='flex-grow mr-2'
            style={{ padding: '8px', borderRadius: '9px' }}
          />
        </Form.Item>
      </Form>
      {form.getFieldsValue().message && (
        <MessageSendButton sendChatMessage={sendChatMessage} />
      )}
    </>
  );
};

export default React.memo(MessageInput);
