import React, { FC, ReactNode, useEffect, useState } from 'react';

export interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => children;

export default AuthGuard;
