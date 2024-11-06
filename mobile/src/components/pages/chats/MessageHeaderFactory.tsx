import React from 'react';
import { Avatar, H3, XStack, Button } from 'tamagui';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import { ArrowLeft } from '@tamagui/lucide-icons';
import { TouchableOpacity } from 'react-native';

const MessageHeaderFactory = ({
  route,
  navigation,
}: NativeStackHeaderProps) => {
  return (
    <XStack
      padding='$2'
      gap='$2'
      backgroundColor='$background'
      style={{ width: '100%' }}
      alignItems='center'
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft />
      </TouchableOpacity>
      <Avatar circular size='$3'>
        <Avatar.Image
          accessibilityLabel={(route.params as any).name}
          src={(route.params as any)?.avatar || '-'}
        />
        <Avatar.Fallback backgroundColor='$blue10' />
      </Avatar>
      <H3>{(route.params as any).name}</H3>
    </XStack>
  );
};

export default MessageHeaderFactory;
