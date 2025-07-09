import { Breakpoint, Empty, Spin } from 'antd';
import { FC, useMemo, useState } from 'react';
import SideBarHeader from './SideBarHeader';
import useChat from './hooks/useChat';
import { reverse, sortBy } from 'lodash-es';
import { useRecoilValue } from 'recoil';
import { $ME } from '../../atoms/root';
import { AllChat, ArchivedChats, AllGroups } from './chatList';
import { DisplayView } from './types';

const SideBar: FC<{
  isDark: boolean;
  screen: Partial<Record<Breakpoint, boolean>>;
}> = (props) => {
  const me = useRecoilValue($ME);
  const { state, action } = useChat();
  const { handelOnDeleteChat, hendelOnArchive, handelOnUnArchive } = action;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayView, setDisplayView] = useState<DisplayView>('all');

  const filteredChats = useMemo(() => {
    return state.chatList.filter((chat) => {
      const receiverName = chat.members.find((m) => m._id !== me?._id)?.name;
      const chatName = chat.name || receiverName || '';
      const lastMessage = chat?.lastMessage?.content || '';

      return (
        chatName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [state.chatList, searchQuery]);

  const sortedChats = useMemo(
    () => reverse(sortBy(filteredChats, 'updatedAt')),
    [filteredChats, state.chatList]
  );

  return (
    <div
      className={`md:w-1/4 lg:w-1/4 w-full ${props.isDark ? 'bg-darkBg' : 'bg-ligthBg'} h-full flex flex-col`}
    >
      <SideBarHeader
        {...state}
        {...action}
        {...props}
        {...{
          searchQuery,
          setDisplayView,
          displayView,
          setSearchQuery,
        }}
      />

      <div
        style={{
          scrollbarWidth: 'thin',
          overflowY: 'auto',
          scrollbarColor: props.isDark ? '#302d2d #171717' : '#f2e9e9 #ffffff',
        }}
      >
        {state.chatListLoding ? (
          <div className=' grid place-content-center '>
            <Spin />
          </div>
        ) : !filteredChats.length ? (
          <Empty description='No chat founded' />
        ) : displayView === 'all' ? (
          <AllChat
            {...{
              ...props,
              me,
              sortedChats,
              hendelOnArchive,
              handelOnDeleteChat,
            }}
          />
        ) : displayView === 'archived' ? (
          <ArchivedChats
            {...{
              ...props,
              me,
              sortedChats,
              handelOnUnArchive,
            }}
          />
        ) : displayView === 'groups' ? (
          <AllGroups
            {...{
              ...props,
              sortedChats,
              hendelOnArchive,
              me,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SideBar;
