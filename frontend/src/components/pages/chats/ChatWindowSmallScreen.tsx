import React, { FC } from 'react';
import { Grid } from 'antd';
import ChatWindow from './ChatWindow';

const { useBreakpoint } = Grid;
const ChatWindowSmallScreen: FC = () => {
  const screen = useBreakpoint();
  return <ChatWindow />;
};

export default ChatWindowSmallScreen;
