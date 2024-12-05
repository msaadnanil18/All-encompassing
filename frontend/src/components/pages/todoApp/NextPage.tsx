import { Typography } from 'antd';
import React from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const NextPage = () => {
  return (
    <div className='h-screen flex'>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default NextPage;
