import { StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { YStack } from 'tamagui';
import { useThemeMode } from '@AllEcompassing/components/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import ChatScreen from './ChatScreen';

const MessagesList: FC<
  NativeStackScreenProps<RootStackParamList, 'Messages'>
> = ({ route }) => {
  const { isDark } = useThemeMode();
  const { chatId } = route.params;
  return (
    <YStack flex={1} backgroundColor={isDark ? '#2f3640' : '#d9d7d7'}>
      <ChatScreen chatId={chatId} />
    </YStack>
  );
};

export default MessagesList;

const styles = StyleSheet.create({});
