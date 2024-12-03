import React from 'react';
import { loginService, logoutService } from '../services/auth';
import { $THEME_C0NFIG } from '../atoms/root';
import { useRecoilState } from 'recoil';
import { $ME } from '../atoms/root';
import { notification } from 'antd';
import { ServiceErrorManager } from '../../helpers/service';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  // const navigate = useNavigate();
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
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem(
        'fallBackLoddingMode',
        data.data.user.themConfig.mode
      );
      // navigate(`/dash-board/${data.data.user?._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fallBackLoddingMode');
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
