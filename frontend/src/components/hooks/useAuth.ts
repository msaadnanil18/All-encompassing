import React from 'react';
import { loginService, logoutService } from '../services/auth';
import { $THEME_C0NFIG } from '../atoms/root';
import { useRecoilState } from 'recoil';
import { $ME } from '../atoms/root';
import { notification } from 'antd';
import { ServiceErrorManager } from '../../helpers/service';

export const useAuth = () => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const [me, setMe] = useRecoilState($ME);
  const [theme, setTheme] = useRecoilState($THEME_C0NFIG);

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
        message: data?.message,
      });

      setMe(data.data.user);
      setTheme(data.data.user.themConfig);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // localStorage.removeItem('storedThemeConfig');
    setMe(null);
    await ServiceErrorManager(logoutService({}), {
      successMessage: `${me?.name} is logout successfully`,
    });
    setTimeout(() => window.location.reload(), 100);
  };
  return { logIn, logOut, me, loading, theme, setTheme };
};
