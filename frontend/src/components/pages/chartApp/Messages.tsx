import React from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { ChatMessageInterface } from '../../types/charts';
import { Typography } from 'antd';
import relativeTime from 'dayjs/plugin/relativeTime';
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
        backgroundColor: isDark ? '#141414' : '#f0f2f5',
        color: 'black',
        borderRadius: '5px',
        padding: '0.5rem',
        width: 'fit-content',
        marginBottom: '10px',
        margin: '10px',
      }}
    >
      {!isMyMessage && (
        <Typography.Text>
          {(chat.sender as { name: string })?.name}
        </Typography.Text>
      )}
      {chat.content && <Typography>{chat.content}</Typography>}

      <Typography.Text type="secondary">
        {dayjs(chat.createdAt).fromNow()}
      </Typography.Text>
    </motion.div>
  );
};

export default Messages;
