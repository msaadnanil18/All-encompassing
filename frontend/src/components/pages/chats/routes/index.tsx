import React, { FC } from 'react';
import { Routes as Router, Route } from 'react-router-dom';
import { initSocketHelper } from '../../../../helpers/socket.helper';
import { ChatProvider } from '../states/ChatContext';
const App = React.lazy(() => import('../index'));

const Routes: FC = () => {
  initSocketHelper(import.meta.env.VITE_SERVER_URI, {
    withCredentials: true,
    auth: {
      token: localStorage.getItem('token'),
    },
  });
  return (
    <ChatProvider>
      <Router>
        <Route path='/' Component={App} />
      </Router>
    </ChatProvider>
  );
};

export default Routes;
