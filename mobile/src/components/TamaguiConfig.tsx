import { View, Text } from 'react-native';
import React, { ReactNode, FC } from 'react';
import { TamaguiProvider } from '@tamagui/core';
import { useThemeMode } from './hooks/useTheme';
import { Theme } from 'tamagui';
import { tamaguiConfig } from '../types/tamagui';

interface TamaguiConfigProps {
  children: ReactNode;
}

const TamaguiConfig: FC<TamaguiConfigProps> = ({ children }) => {
  const { isDark } = useThemeMode();

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Theme name={isDark ? 'dark' : 'light'}>{children}</Theme>
    </TamaguiProvider>
  );
};

export default TamaguiConfig;
