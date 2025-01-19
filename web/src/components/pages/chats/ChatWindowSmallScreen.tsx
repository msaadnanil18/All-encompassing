import React, { FC } from 'react';
import { Grid } from 'antd';
import ChatWindow from './ChatWindow';
import { useDarkMode } from '../../thems/useDarkMode';

const { useBreakpoint } = Grid;
const ChatWindowSmallScreen: FC = () => {
  const screen = useBreakpoint();
  const isDark = useDarkMode();
  return <ChatWindow {...{ screen, isDark }} />;
};

export default ChatWindowSmallScreen;
