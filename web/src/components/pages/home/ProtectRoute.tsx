import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User } from '../../types/partialUser';

const ProtectRoute = ({
  user,
  redirect = '/',
}: {
  user: User | null;
  redirect: string;
}) => {
  return user ? <Outlet /> : <Navigate to={redirect} />;
};

export default ProtectRoute;
