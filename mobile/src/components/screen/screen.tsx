import React, { FC } from 'react';
import { YStack } from 'tamagui';

export interface ScreenProps {
  children: React.ReactNode;
}

const Screen: FC<ScreenProps> = ({ children }) => {
  return (
    <YStack backgroundColor='$background' style={{ flex: 1 }}>
      {children}
    </YStack>
  );
};

export default Screen;
