import {
  Breakpoint,
  Button,
  Dropdown,
  Empty,
  Menu,
  Spin,
  Typography,
} from 'antd';
import { FC, useMemo, useState } from 'react';
import SideBarHeader from './SideBarHeader';
import useChat from './hooks/useChat';
import { reverse, sortBy } from 'lodash-es';
import { useRecoilValue } from 'recoil';
import { $ME } from '../../atoms/root';
import { AllChat, ArchivedChats } from './chatList';
import { DisplayView } from './types';
import AllGroups from './chatList/AllGroups';

const SideBar: FC<{
  isDark: boolean;
  screen: Partial<Record<Breakpoint, boolean>>;
}> = (props) => {
  const { isDark, screen } = props;
  const me = useRecoilValue($ME);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayView, setDisplayView] = useState<DisplayView>('all');
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
      hendelOnArchive,
      handelOnUnArchive,
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
    [filteredChats, chatList]
  );

  return (
    <div
      className={`md:w-1/4 lg:w-1/4 w-full ${isDark ? 'bg-darkBg' : 'bg-ligthBg'} h-full flex flex-col`}
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
          setDisplayView,
          displayView,
        }}
      />

      <div
        style={{
          scrollbarWidth: 'thin',
          overflowY: 'auto',
          scrollbarColor: isDark ? '#302d2d #171717' : '#f2e9e9 #ffffff',
        }}
      >
        {chatListLoding ? (
          <div className=' grid place-content-center '>
            <Spin />
          </div>
        ) : !filteredChats.length ? (
          <Empty description='No chat founded' />
        ) : displayView === 'all' ? (
          <AllChat {...{ me, sortedChats, hendelOnArchive, isDark }} />
        ) : displayView === 'archived' ? (
          <ArchivedChats {...{ me, sortedChats, isDark, handelOnUnArchive }} />
        ) : displayView === 'groups' ? (
          <AllGroups {...{ sortedChats, isDark, hendelOnArchive, me }} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default SideBar;
