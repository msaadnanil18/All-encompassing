import { FC } from 'react';
import RenderAvatar from './RenderAavtar';
import { Breakpoint, Typography } from 'antd';
import { ChatListItem } from './types';
import { User } from '../../types/partialUser';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const ChatList: FC<{
  chat: ChatListItem;
  me: User | null;
  isDark?: boolean;
  screen?: Partial<Record<Breakpoint, boolean>>;
}> = ({ chat, me, isDark, screen }) => {
  const navigate = useNavigate();
  const receiver = chat.members.find((m) => m._id !== me?._id);
  return (
    <div
      key={chat?._id}
      className={`p-4 ${
        false ? 'bg-gray-300' : ''
      } ${isDark ? ' hover:bg-darkHover' : 'hover:bg-lightHover'} cursor-pointer flex items-center`}
      {...(screen?.xs
        ? { onClick: () => navigate(`/chat-app--/${me?._id}/${chat._id}`) }
        : {})}
    >
      <RenderAvatar {...{ receiver, chat }} />
      <div className='ml-3'>
        <Typography.Text strong style={{ margin: 0, padding: 0 }}>
          {chat?.name || receiver?.name}
        </Typography.Text>
        <Typography.Paragraph
          type='secondary'
          className='text-sm '
          style={{ margin: 0, padding: 0 }}
        >
          {chat?.lastMessage?.content || 'Meeting at 3 PM'}
        </Typography.Paragraph>
        {chat.groupChat ? null : (receiver as any)?.status?.isOnline ? (
          <span className='text-xs text-gray-500'>Online</span>
        ) : (receiver as any)?.status?.lastSeen ? (
          <span className='text-xs text-gray-500'>
            Last seen {dayjs((receiver as any).status?.lastSeen).fromNow()}
          </span>
        ) : (
          <span className='text-xs text-gray-500'>Offline</span>
        )}
      </div>
    </div>
  );
};

export default ChatList;
