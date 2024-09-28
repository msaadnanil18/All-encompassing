import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
const ResgisterUser = React.lazy(
  () => import('./components/pages/home/Create')
);

const NavBar = React.lazy(
  () => import('./components/pages/chartApp/UserListHeader')
);
const VerifyEmail = React.lazy(() => import('./components/pages/VerifyEmail'));
const LoginUser = React.lazy(() => import('./components/pages/home/Login'));
const ChatApp = React.lazy(
  () => import('./components/pages/chartApp/ChatAppRoutes')
);
const Setting = React.lazy(() => import('./components/pages/settings'));

const TodoApp = React.lazy(
  () => import('./components/pages/todoApp/TodoAppRoutes')
);

const DashBoard = React.lazy(() => import('./components/pages/DashBoard'));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Routes>
          <Route path="/resgister-user" Component={ResgisterUser} />
          <Route path="/verify-email" Component={VerifyEmail} />
          <Route path="/" Component={LoginUser} />
          <Route path="/dash-board/:id" Component={DashBoard} />
          <Route path="/chat-app--/:id/*" Component={ChatApp} />
          <Route path="/setting--/:id" Component={Setting} />
          <Route path="/todo-app--/:id/*" Component={TodoApp} />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
