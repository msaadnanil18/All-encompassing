import { Route, Routes } from 'react-router-dom';
import React from 'react';
//import NextPage from './NextPage';
const NextPage = React.lazy(() => import('./NextPage'));
const TodoApp = React.lazy(() => import('.'));
const TodoAppRoutes = () => {
  return (
    <Routes>
      <Route path='/' Component={TodoApp} />
      <Route path='/next-page' Component={NextPage} />
    </Routes>
  );
};

export default TodoAppRoutes;
