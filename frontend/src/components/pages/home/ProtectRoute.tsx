import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User } from '../../types/partialUser';

const ProtectRoute = ({
  children,
  user,
  redirect = '/',
}: {
  children: React.ReactNode;
  user: User | null;
  redirect: string;
}) => {
  return user ? children ? children : <Outlet /> : <Navigate to={redirect} />;
};

export default ProtectRoute;
