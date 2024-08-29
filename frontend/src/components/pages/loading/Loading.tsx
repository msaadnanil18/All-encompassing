import React from 'react';
import './loading.css';

const Loading = () => {
  return (
    <div
      style={{ backgroundColor: '#212121' }}
      className="grid place-content-center h-screen"
    >
      <div className="loader" />
    </div>
  );
};

export default Loading;
