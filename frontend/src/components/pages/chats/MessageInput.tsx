import {
  AudioOutlined,
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Breakpoint, Button, Card, Form, FormInstance, Input } from 'antd';
import React, { FC, Ref, useRef, useState } from 'react';
import { getBackgroundColor } from '../../utills';
import AddAttachments from './AddAttachments';

const MessageInput: FC<{
  screen: Partial<Record<Breakpoint, boolean>>;
  messageOnSend: (r: string) => Promise<void>;
  messageForm: FormInstance;
  isDark: boolean;
  emojiToggleRef: Ref<{
    toggle: () => void;
  }>;
}> = (props) => {
  const { screen } = props;
  const [message, setMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<Array<{}> | null>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const inputRef = useRef<any>(null);

  const handleSendMessage = async () => {
    setMessage('');
    await props.messageOnSend(message);
    inputRef.current?.focus();
  };

  return (
    <Card
      bodyStyle={{ padding: '16px' }}
      bordered={false}
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: getBackgroundColor(props.isDark),
        borderRadius: 0,
      }}
      size={screen.xs ? 'small' : 'default'}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          height: '100%',
        }}
      >
        <AddAttachments />
        {/* <Button
          type='text'
          shape='circle'
          icon={<PlusOutlined style={{ fontSize: '20px' }} />}
          //   onClick={() => {
          //     if ((emojiToggleRef as any).current) {
          //       (emojiToggleRef as any).current.toggle();
          //     }
          //   }}
        /> */}
        <Button
          type='text'
          shape='circle'
          icon={<SmileOutlined style={{ fontSize: '20px' }} />}
          onClick={() => {
            if ((props.emojiToggleRef as any).current) {
              (props.emojiToggleRef as any).current.toggle();
            }
          }}
        />
        <div className=' w-full'>
          <Form form={props.messageForm}>
            <Form.Item name='attachments' noStyle />

            <Form.Item noStyle name='content'>
              <Input
                ref={inputRef}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await handleSendMessage();
                  }
                }}
                value={message}
                placeholder='Type a message...'
                style={{
                  padding: '7px',
                  fontSize: '14px',
                }}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Item>
          </Form>
        </div>
        {message.trim()?.length > 0 ? (
          <Button
            icon={<SendOutlined />}
            shape='circle'
            onClick={handleSendMessage}
            style={{ display: 'inline-flex' }}
          />
        ) : (
          <Button
            icon={<AudioOutlined />}
            shape='circle'
            onClick={handleSendMessage}
            style={{ display: 'inline-flex' }}
          />
        )}
      </div>
    </Card>
  );
};

export default React.memo(MessageInput);
