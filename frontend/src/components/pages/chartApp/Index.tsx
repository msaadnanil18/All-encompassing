import React from 'react';
import useAuth from '../../hooks/useAuth';

const Index: React.FC = () => {
  const { me } = useAuth();
  const token = localStorage.getItem('token');
  console.log(token, 'tokent');

  console.log(me, 'meee');

  return <div>Index</div>;
};

export default Index;
