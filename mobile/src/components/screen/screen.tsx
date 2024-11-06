import React, { FC, ReactNode } from 'react';
import { YStack } from 'tamagui';

export interface ScreenProps {
  children: ReactNode;
}

const Screen: FC<ScreenProps> = ({ children }) => {
  return (
    <YStack backgroundColor='$background' style={{ flex: 1 }}>
      {children}
    </YStack>
  );
};

export default Screen;
