import { Dropdown, Menu, Typography } from 'antd';
import { FC } from 'react';
import RenderAvatar from '../RenderAavtar';
import dayjs from 'dayjs';
import { ChatListItem } from '../types';
import { User } from '../../../types/partialUser';
import ConfirmDelete from './ConfirmDelete';

const AllChat: FC<{
  sortedChats: Array<ChatListItem>;
  me: User | null;
  hendelOnArchive: (r?: string) => void;
  isDark: boolean;
}> = ({ sortedChats, me, hendelOnArchive, isDark }) => {
  return sortedChats
    .filter((chat) =>
      chat.archivedBy.length > 0
        ? !chat.archivedBy.some((arch) => arch.user?._id === me?._id)
        : true
    )
    .map((chat) => {
      const receiver = chat.members.find((m) => m._id !== me?._id);
      // const isSelected = selectedChat?._id === chat?._id;
      return (
        <Dropdown
          key={chat._id}
          overlayStyle={{ margin: 0, padding: 0 }}
          overlay={
            <Menu>
              <Menu.Item onClick={() => hendelOnArchive(chat._id)}>
                Archive chat
              </Menu.Item>
              <Menu.Item>
                <ConfirmDelete title='Are you sure you want to delete this chat?'>
                  Delete chat
                </ConfirmDelete>
              </Menu.Item>
              {chat.groupChat && (
                <Menu.Item>
                  <ConfirmDelete title='Are you sure you want to exit this group?'>
                    Exit group
                  </ConfirmDelete>
                </Menu.Item>
              )}
            </Menu>
          }
          trigger={['contextMenu']}
          placement='bottomLeft'
        >
          <div
            key={chat?._id}
            className={`p-4 ${
              false ? 'bg-gray-300' : ''
            } ${isDark ? ' hover:bg-darkHover' : 'hover:bg-lightHover'} cursor-pointer flex items-center`}
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
                  Last seen{' '}
                  {dayjs((receiver as any).status?.lastSeen).fromNow()}
                </span>
              ) : (
                <span className='text-xs text-gray-500'>Offline</span>
              )}
            </div>
          </div>
        </Dropdown>
      );
    });
};

export default AllChat;
