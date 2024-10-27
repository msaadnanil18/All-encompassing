import { useColorScheme } from 'react-native';

export const useThemeMode = () => {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const isLight = !isDark;

  return { isDark, isLight };
};
