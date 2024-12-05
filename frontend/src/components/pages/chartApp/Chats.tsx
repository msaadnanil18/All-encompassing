import { SmileOutlined } from '@ant-design/icons';
import MessageInput from './MessageInput';
import MessageSendButton from './MessageSendButton';
import React, { Ref, Dispatch, SetStateAction } from 'react';
import { Button, Card, Empty, Form, FormInstance } from 'antd';
import { ChatMessageInterface } from '../../types/charts';
import { useDarkMode } from '../../thems/useDarkMode';
import EmojiPiker from '../../emojiPicker/EmojiPiker';
import DriveFileUpload from '../../../driveFileUpload';
import { addFiles } from '../../types/addFiles';
import Messages from './Messages';
import AttachmentsView from './AttachmentsView';
import { useSearchParams } from 'react-router-dom';

interface ChartProps {
  chatLoading: boolean;
  isModalOpen: boolean;
  setMessageEditId: Dispatch<SetStateAction<string | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  handleOnMessageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  form: FormInstance;
  _attachments: addFiles[];
  sendChatMessage: () => void;
  chats: ChatMessageInterface[];
  userId: string | undefined;
  handelOnDeleteMessage: (r: ChatMessageInterface) => Promise<void>;
}

const Chats = ({
  handleOnMessageChange,
  form,
  isModalOpen,
  setIsModalOpen,
  sendChatMessage,
  chats,
  userId,
  chatLoading,
  setMessageEditId,
  handelOnDeleteMessage,
  _attachments,
}: ChartProps) => {
  const isDark = useDarkMode();

  const onEdit = (editData: ChatMessageInterface) => {
    const data = { target: { value: editData.content } };
    setMessageEditId(editData._id || '');
    form.setFieldValue('message', editData.content);
    handleOnMessageChange(
      data as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    );
  };

  const onDelete = (r: ChatMessageInterface) => {
    handelOnDeleteMessage(r);
  };

  return (
    <div className='relative flex flex-col'>
      <AttachmentsView
        {...{
          form,
          isModalOpen,
          setIsModalOpen,
          value: 'message',
          onChange: handleOnMessageChange,
          send: sendChatMessage,
          attachments: _attachments,
        }}
      />
      {!(chats || []).length ? (
        <div className=' grid place-content-center mt-36'>
          <Empty description='No chats please select user' />
        </div>
      ) : chatLoading ? (
        Array.from({ length: 20 }, (_, i) => i).map((_, i) => (
          <Card
            bordered={false}
            size='small'
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
          <Messages
            {...{ chat, userId, isDark, onEdit, onDelete }}
            key={chat._id}
          />
        ))
      )}
    </div>
  );
};

export default React.memo(Chats);
