import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

const Home = React.lazy(() => import('./components/pages/Home'));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Routes>
          <Route path="/" Component={Home} />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
