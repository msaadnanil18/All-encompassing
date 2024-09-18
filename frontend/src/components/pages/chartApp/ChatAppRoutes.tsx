import React from 'react';
import { Routes, Route } from 'react-router-dom';
const app = React.lazy(() => import('./Index'));
const ChatAppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" Component={app} />
    </Routes>
  );
};

export default ChatAppRoutes;
