import { StyleSheetProperties } from 'react-native';
import React, { FC } from 'react';
import { Text, View, XStack } from 'tamagui';
import Screen from '@AllEcompassing/components/screen/screen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import ChatList from './chatList';
const Chats: FC<NativeStackScreenProps<RootStackParamList>> = (props) => {
  return (
    <Screen>
      <ChatList />
    </Screen>
  );
};

export default Chats;
