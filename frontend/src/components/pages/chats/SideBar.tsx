import { Breakpoint, Dropdown, Empty, Menu, Spin, Typography } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import SideBarHeader from './SideBarHeader';
import useChat from './hooks/useChat';
import { reverse, sortBy } from 'lodash-es';
import { useRecoilValue } from 'recoil';
import { $ME } from '../../atoms/root';
import RenderAvatar from './RenderAavtar';
import dayjs from 'dayjs';

const SideBar: FC<{
  isDark: boolean;
  screen: Partial<Record<Breakpoint, boolean>>;
}> = (props) => {
  const me = useRecoilValue($ME);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { isDark, screen } = props;

  const {
    state: {
      openDrawe,
      isGroupChatCrate,
      submitLoading,
      chatList,
      chatListLoding,
    },
    action: {
      setIsGroupChatCrate,
      setOpenDrawer,
      onSelectUser,
      chatForm,
      createGroupChat,
    },
  } = useChat();

  const filteredChats = useMemo(() => {
    return chatList.filter((chat) => {
      const receiverName = chat.members.find((m) => m._id !== me?._id)?.name;
      const chatName = chat.name || receiverName || '';
      const lastMessage = chat?.lastMessage?.content || '';

      return (
        chatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [chatList, searchQuery]);

  const sortedChats = useMemo(
    () => reverse(sortBy(filteredChats, 'updatedAt')),
    [filteredChats]
  );

  return (
    <div
      className={`md:w-1/4 lg:w-1/4 w-full ${isDark ? 'bg-[#171717] border-r-black' : 'bg-[#f4f7d5] border-r-[#f4f7d5]'} h-full flex flex-col`}
    >
      <SideBarHeader
        {...{
          openDrawe,
          isGroupChatCrate,
          setIsGroupChatCrate,
          setOpenDrawer,
          onSelectUser,
          screen,
          isDark,
          chatForm,
          submitLoading,
          createGroupChat,
          setSearchQuery,
          searchQuery,
        }}
      />
      <div
        style={{
          scrollbarWidth: 'thin',
          overflowY: 'auto',
          // height: screen.xs ? '' : 'calc(100 - 100px)',
        }}
      >
        {chatListLoding ? (
          <div className=' grid place-content-center '>
            <Spin />
          </div>
        ) : !filteredChats.length ? (
          <Empty description='No chat founded' />
        ) : (
          sortedChats.map((chat) => {
            const receiver = chat.members.find((m) => m._id !== me?._id);
            // const isSelected = selectedChat?._id === chat?._id;
            return (
              <Dropdown
                key={chat._id}
                overlayStyle={{ margin: 0, padding: 0 }}
                overlay={
                  <Menu>
                    <Menu.Item>Archive chat</Menu.Item>
                  </Menu>
                }
                trigger={['contextMenu']}
                placement='bottomLeft'
              >
                <div
                  key={chat?._id}
                  className={`p-4 ${
                    false ? 'bg-gray-300' : ''
                  } ${isDark ? 'hover:bg-[#2e2c2c]  ' : ' hover:bg-[#fcfde9]'} cursor-pointer flex items-center`}
                  // onClick={() => {

                  //   if (screen.xs) {
                  //     sdk.navigate({

                  //       path: `/${kebabCase(chat?.name || receiver?.name)}--${
                  //         chat?._id
                  //       }`,
                  //     });
                  //   } else {
                  //     setSelectedChat(chat);
                  //   }
                  // }}
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
                    {chat.groupChat ? null : (receiver as any)?.status
                        ?.isOnline ? (
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
          })
        )}
      </div>
    </div>
  );
};

export default SideBar;
