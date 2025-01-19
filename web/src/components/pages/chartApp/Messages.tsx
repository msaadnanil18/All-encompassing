import React, { useState, FC } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { ChatMessageInterface } from '../../types/charts';
import { Card, Typography, Dropdown, MenuProps } from 'antd';
import RenderAttachments from '../../../driveFileUpload/ReanderAttachments.';
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';

const Messages: FC<{
  chat: ChatMessageInterface;
  userId: string | undefined;
  isDark: boolean;
  onEdit: (r: ChatMessageInterface) => void;
  onDelete: (r: ChatMessageInterface) => void;
}> = ({ chat, userId, isDark, onEdit, onDelete }) => {
  const [hover, setHover] = useState(false);
  const isMyMessage = chat.sender === userId;

  const massageCards = (
    <Card
      bordered={false}
      bodyStyle={{ padding: 0 }}
      size='small'
      style={{
        backgroundColor: isDark ? '#141414' : '#f0f2f5',
        borderRadius: '5px',
        padding: '0.5rem',
        width: 'fit-content',
        margin: '10px',
        // maxWidth: '70%',
      }}
    >
      <div style={{ padding: '0.3rem 0.8rem' }}>
        {isMyMessage && (
          <div className=' flex justify-between'>
            <MenuTogglers {...{ onDelete, chat, hover, onEdit }} />
          </div>
        )}

        {!isMyMessage && (
          <Typography.Text>
            {(chat.sender as { name: string })?.name}
          </Typography.Text>
        )}
        {chat.attachments?.map((file) => (
          <RenderAttachments
            key={file._id}
            url={file.url}
            width={'200px'}
            height={'150px'}
          />
        ))}
        {chat.content && <Typography>{chat.content}</Typography>}
        <Typography.Text
          type='secondary'
          style={{
            fontSize: '0.75rem',
            marginTop: '0.5rem',
            textAlign: 'right',
            display: 'block',
            margin: 0,
            padding: 0,
          }}
        >
          {dayjs(chat.createdAt).fromNow()}
        </Typography.Text>
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: '-100%' }}
      whileInView={{ opacity: 1, x: 0 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        maxWidth: '50%',
      }}
    >
      {massageCards}
    </motion.div>
  );
};

export default React.memo(Messages);

const MenuTogglers: FC<{
  hover: boolean;
  chat: ChatMessageInterface;
  onDelete: (r: ChatMessageInterface) => void;
  onEdit: (r: ChatMessageInterface) => void;
}> = ({ hover, chat, onEdit, onDelete }) => {
  const driveFileCtxMenu: MenuProps['items'] = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => {
        onEdit(chat);
      },
    },

    {
      key: 'DELETE',
      label: 'Delete ',
      icon: <DeleteOutlined color='red' />,
      onClick: () => {
        onDelete(chat);
      },
    },
  ];
  return (
    <Dropdown
      menu={{
        style: { width: '200px' },
        items: driveFileCtxMenu,
      }}
      trigger={['click']}
      className=' cursor-pointer'
    >
      <span
        style={{
          position: 'absolute',
          top: '1px',
          right: '5px',
          fontSize: '0.8rem',

          opacity: hover ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <Typography.Text className='cursor-pointer '>
          <DownOutlined />
        </Typography.Text>
      </span>
    </Dropdown>
  );
};
