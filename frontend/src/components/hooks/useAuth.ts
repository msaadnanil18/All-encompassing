import React from 'react';
import { loginService } from '../services/auth';
import { PartialUser } from '../atoms/root';
import { useRecoilState } from 'recoil';
import { $ME } from '../atoms/root';

export const useAuth = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<PartialUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [me, setMe] = useRecoilState($ME);
  setMe(user);
  const logIn = async (value: Record<string, any>) => {
    setLoading(true);
    try {
      const { data } = await loginService({
        data: {
          payload: { ...value },
        },
      });

      localStorage.setItem('token', data?.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data?.data));

      setUser(data.data.user);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const logOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTimeout(() => (window.location.href = '/'), 50);
  };
  return { logIn, logOut, me, loading };
};
