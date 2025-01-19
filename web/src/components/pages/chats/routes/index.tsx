import React, { FC } from 'react';
import { Routes as Router, Route } from 'react-router-dom';
import { initSocketHelper } from '../../../../helpers/socket.helper';
import { ChatProvider } from '../states/ChatContext';
import Chats from '..';
import ChatWindowSmallScreen from '../ChatWindowSmallScreen';

const Routes: FC = () => {
  initSocketHelper(import.meta.env.VITE_SERVER_URI, {
    withCredentials: true,
    auth: {
      token: localStorage.getItem('token'),
    },
  });
  return (
    // <ChatProvider>
    <Router>
      <Route path='/' Component={Chats} />
      <Route path='/:chatId' Component={ChatWindowSmallScreen} />
    </Router>
    //   </ChatProvider>
  );
};

export default Routes;
