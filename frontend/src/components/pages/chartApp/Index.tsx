import React from 'react';
import { useRecoilValue } from 'recoil';
import { $ME } from '../../atoms/root';
import { useAuth } from '../../hooks/useAuth';
import { Button } from 'antd';
import Chart from './Chart';
import { SettingOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { me, logOut } = useAuth();
  const token = localStorage.getItem('token');
  // console.log(token, 'tokent');

  return (
    <div>
      <Button onClick={logOut}>Log out</Button>
      <Button
        onClick={() => navigate(`/setting/${id}`)}
        icon={<SettingOutlined />}
      >
        Setting
      </Button>
      <Chart id={id} />
    </div>
  );
};

export default Index;
