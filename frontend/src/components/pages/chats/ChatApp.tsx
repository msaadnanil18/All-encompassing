import React, { useState } from 'react';
import { Grid } from 'antd';
import { ChatListItem } from './types';
import Sidebar from './SideBar';
import ChatWindow from './ChatWindow';
import { useDarkMode } from '../../thems/useDarkMode';
const { useBreakpoint } = Grid;

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const isDark = useDarkMode();

  const screen = useBreakpoint();
  return (
    <div className='h-screen md:flex lg:flex'>
      <Sidebar {...{ isDark, screen }} />
      {!screen.xs && <ChatWindow />}
    </div>
  );
};

export default ChatApp;
