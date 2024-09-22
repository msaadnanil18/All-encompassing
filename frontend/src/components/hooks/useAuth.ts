import React from 'react';
import { loginService } from '../services/auth';
import { $THEME_C0NFIG, PartialUser, ThemeConfig } from '../atoms/root';
import { useRecoilState } from 'recoil';
import { $ME } from '../atoms/root';
import { notification } from 'antd';

export const useAuth = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<PartialUser | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [themConfig, setThemConfig] = React.useState<ThemeConfig>(() => {
    const storedUser = localStorage.getItem('themeConfig');
    if (storedUser === 'undefined') {
      return null;
    } else {
      return storedUser ? JSON.parse(storedUser) : null;
    }
  });
  const [me, setMe] = useRecoilState($ME);
  const [theme, setTheme] = useRecoilState($THEME_C0NFIG);

  React.useEffect(() => {
    if (user) {
      setMe(user);
    }
  }, [user, setMe]);

  React.useEffect(() => {
    if (themConfig) {
      setTheme(themConfig);
    }
  }, [themConfig, setTheme]);

  const logIn = async (value: Record<string, any>) => {
    setLoading(true);
    try {
      const { data } = await loginService({
        data: {
          payload: { ...value },
        },
      });

      if (!data) return;
      notification.open({
        message: data.message,
      });

      localStorage.setItem('token', data?.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data?.data));
      localStorage.setItem(
        'themeConfig',
        JSON.stringify(data?.data?.user?.themConfig)
      );
      setThemConfig(data?.data?.user?.themConfig);
      setUser(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const logOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('themeConfig');
    setUser(null);
    setTimeout(() => (window.location.href = '/'), 50);
  };
  return { logIn, logOut, me, loading, setThemConfig, theme };
};
