import React from 'react';
import './loading.css';

const Loading: React.FC = () => {
  const mode = localStorage.getItem('fallBackLoddingMode');
  return (
    <div
      style={
        mode === 'LIGHT'
          ? { backgroundColor: '#fdffeb' }
          : { backgroundColor: '#212121' }
      }
      className='grid place-content-center h-screen'
    >
      <div className='loader' />
    </div>
  );
};

export default Loading;
