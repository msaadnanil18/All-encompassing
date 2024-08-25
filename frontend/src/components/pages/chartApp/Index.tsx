import React from 'react';
import { useRecoilValue } from 'recoil';
import { $ME } from '../../atoms/root';
import { useAuth } from '../../hooks/useAuth';
import { Button } from 'antd';
const Index: React.FC = () => {
  const { me, logOut } = useAuth();
  const token = localStorage.getItem('token');
  console.log(token, 'tokent');
  // const me = useRecoilValue($ME);

  console.log(me, 'meee');

  return (
    <div>
      <Button onClick={logOut}>Log out</Button>
    </div>
  );
};

export default Index;
