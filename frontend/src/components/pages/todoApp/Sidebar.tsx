import React from 'react';
import { Avatar } from 'antd';
import { chatList } from './dummyData';

const Sidebar: React.FC = () => {
  return (
    <div className='w-1/4 bg-gray-100 border-r h-full flex flex-col'>
      <div className='p-4 flex items-center justify-between bg-gray-200'>
        <Avatar size={40} />
        <h2 className='text-xl font-semibold'>Chats</h2>
      </div>
      <div
        style={{ scrollbarWidth: 'thin' }}
        className='flex-grow overflow-y-auto'
      >
        {chatList.map((chat) => (
          <div
            key={chat.id}
            className='p-4 hover:bg-gray-200 cursor-pointer flex items-center'
          >
            <Avatar size={40} />
            <div className='ml-3'>
              <h3 className='font-medium'>{chat.name}</h3>
              <p className='text-sm text-gray-600'>{chat.message}</p>
              <span className='text-xs text-gray-500'>{chat.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
