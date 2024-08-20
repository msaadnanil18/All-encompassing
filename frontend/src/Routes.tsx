import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
const ResgisterUser = React.lazy(
  () => import('./components/pages/home/Create')
);
const App = React.lazy(() => import('./components/pages/chartApp/Index'));
const NavBar = React.lazy(() => import('./components/pages/home/NavBar'));
const VerifyEmail = React.lazy(() => import('./components/pages/VerifyEmail'));
const LoginUser = React.lazy(() => import('./components/pages/home/Login'));
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        {/* <NavBar /> */}
        <Routes>
          <Route path="/resgister-user" Component={ResgisterUser} />
          <Route path="/verify-email" Component={VerifyEmail} />
          <Route path="/" Component={LoginUser} />
          <Route path="/app--/:id" Component={App} />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
