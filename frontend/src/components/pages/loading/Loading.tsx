import React from 'react';
import './loading.css';

const Loading: React.FC = () => {
  const mode = localStorage.getItem('fallBackLoddingMode');
  return (
    <div
      className={`grid place-content-center h-screen ${mode === 'LIGHT' ? 'bg-ligthBg' : 'bg-darkBg'} `}
    >
      <div className='loader' />
    </div>
  );
};

export default Loading;
