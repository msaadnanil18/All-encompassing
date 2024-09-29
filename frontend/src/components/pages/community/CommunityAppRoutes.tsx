import React from 'react';
import { Route, Routes } from 'react-router-dom';

const communityApp = React.lazy(() => import('.'));

const CommunityAppRoutes = () => {
  return (
    <Routes>
      <Route path="/" Component={communityApp} />
    </Routes>
  );
};

export default CommunityAppRoutes;
