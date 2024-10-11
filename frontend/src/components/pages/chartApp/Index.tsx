import React from 'react';
import { useParams } from 'react-router-dom';
import UserListTab from './UserListTab';

const chartApp: React.FC = () => {
  const { id } = useParams();

  return <UserListTab userId={id} />;
};

export default chartApp;
