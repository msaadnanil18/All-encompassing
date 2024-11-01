import { $ME, $THEME_C0NFIG } from '@AllEcompassing/components/atoms/roots';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { ServiceErrorManager } from '@AllEcompassing/helpers/service';
import { LoginService } from '@AllEcompassing/components/Services/auth';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [me, setMe] = useRecoilState($ME);
  const [theme, setTheme] = useRecoilState($THEME_C0NFIG);

  const login = async (value: Record<string, any>) => {
    setLoading(true);
    try {
      const [err, data] = await ServiceErrorManager(
        LoginService({
          data: {
            payload: { ...value },
          },
        }),
        {},
      );
      if (!data) return;

      Toast.show({
        text1: data?.message,
      });
      setMe(data.data.user);
      setTheme(data.data.user.themConfig);
      console.log(data.data.accessToken, 'tokesss');

      await AsyncStorage.setItem('token', data.data.accessToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, me, theme, setTheme };
};
