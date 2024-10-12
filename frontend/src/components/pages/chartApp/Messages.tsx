import React from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { ChatMessageInterface } from '../../types/charts';
import { Card, Typography } from 'antd';
import relativeTime from 'dayjs/plugin/relativeTime';
import RenderAttachments from '../../../driveFileUpload/ReanderAttachments.';
dayjs.extend(relativeTime);

const Messages = ({
  chat,
  userId,
  isDark,
}: {
  chat: ChatMessageInterface;
  userId: string | undefined;
  isDark: boolean;
}) => {
  const isMyMessage = chat.sender === userId;

  return (
    <motion.div
      initial={{ opacity: 0, x: '-100%' }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
      }}
    >
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
        }}
      >
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

        <Typography.Text type='secondary'>
          {dayjs(chat.createdAt).fromNow()}
        </Typography.Text>
      </Card>
    </motion.div>
  );
};

export default React.memo(Messages);
