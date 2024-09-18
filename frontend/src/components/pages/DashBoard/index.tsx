import React from 'react';
import { Routes, Route } from 'react-router-dom';
const Home = React.lazy(() => import('./Home'));

const DashBoard = () => {
  return <Home />;
};

export default DashBoard;
