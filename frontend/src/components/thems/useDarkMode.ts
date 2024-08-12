import { useRecoilValue } from 'recoil';
import { $THEME_C0NFIG } from '../atoms/root';

export const useConfig = () => {
  const config = useRecoilValue($THEME_C0NFIG);
  return config;
};

export const useDarkMode = () => {
  const config = useConfig();
  return config?.mode === 'DARK';
};
