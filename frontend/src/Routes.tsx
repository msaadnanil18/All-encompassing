import React from 'react';
import NotFound404 from './components/pages/notFound404/NotFound404';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { $ME } from './components/atoms/root';
import ProtectRoute from './components/pages/home/ProtectRoute';
const ResgisterUser = React.lazy(
  () => import('./components/pages/home/Create')
);

const NavBar = React.lazy(
  () => import('./components/pages/chartApp/UserListHeader')
);
const VerifyEmail = React.lazy(() => import('./components/pages/VerifyEmail'));
const LoginUser = React.lazy(() => import('./components/pages/home/Login'));
const ChatApp = React.lazy(() => import('./components/pages/chartApp/Index'));
const Setting = React.lazy(() => import('./components/pages/settings'));

const TodoApp = React.lazy(
  () => import('./components/pages/todoApp/TodoAppRoutes')
);

const DashBoard = React.lazy(() => import('./components/pages/DashBoard'));
const CommunityApp = React.lazy(
  () => import('./components/pages/community/CommunityAppRoutes')
);
const AppRoutes = () => {
  const user = useRecoilValue($ME);
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Routes>
          <Route path='/resgister-user' Component={ResgisterUser} />
          <Route path='/verify-email' Component={VerifyEmail} />
          <Route path='/' Component={LoginUser} />
          <Route element={<ProtectRoute user={user} redirect='/' />}>
            <Route path='/dash-board/:id' element={<DashBoard />} />
            <Route path='/chat-app--/:id/*' Component={ChatApp} />
            <Route path='/setting--/:id' Component={Setting} />
            <Route path='/todo-app--/:id/*' Component={TodoApp} />
            <Route path='/community-app--/:id/*' Component={CommunityApp} />
          </Route>

          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
