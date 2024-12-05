import React from 'react';
import { Input } from 'antd';
import { chatMessages } from './dummyData';
// import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';

const ChatWindow: React.FC = () => {
  return (
    <div className='w-3/4 flex flex-col h-full'>
      <div className='p-4 bg-gray-200 border-b'>
        <h2 className='text-lg font-semibold'>John Doe</h2>
      </div>
      <div
        style={{ scrollbarWidth: 'thin' }}
        className='flex-grow overflow-y-auto p-4 bg-white'
      >
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 ${
              msg.sender === 'me' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`${
                msg.sender === 'me'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
              } p-2 rounded-md inline-block`}
            >
              {msg.message}
            </div>
            <div className='text-xs text-gray-500 mt-1'>{msg.time}</div>
          </div>
        ))}
      </div>
      <div className='p-4 border-t flex items-center'>
        {/* <Picker onSelect={(e: any) => console.log(e)} /> */}
        <Input
          placeholder='Type a message...'
          className='rounded-lg flex-grow'
        />
        <button className='ml-2 bg-blue-500 text-white p-2 rounded-md'>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
