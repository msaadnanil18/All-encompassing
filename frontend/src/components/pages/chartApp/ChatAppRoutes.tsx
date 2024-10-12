import React from 'react';
import { Routes, Route } from 'react-router-dom';
const App = React.lazy(() => import('./Index'));
const ChatAppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' Component={App} />
    </Routes>
  );
};

export default ChatAppRoutes;
