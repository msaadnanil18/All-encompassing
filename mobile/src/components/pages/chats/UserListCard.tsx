import { StyleSheet, View } from 'react-native';
import React from 'react';
import { XStack, YStack, Text, Image } from 'tamagui';
import dayjs from 'dayjs';
import { User } from '@AllEcompassing/types/partialUser';

const UserListCard = ({
  _prevChats,
  updatedAt,
}: {
  _prevChats: User;
  updatedAt?: Date | string;
}) => {
  return (
    <XStack space='$3'>
      <Image
        height={50}
        width={50}
        borderRadius={35}
        src={_prevChats?.avatar}
      />
      <YStack flex={1} space='$1'>
        <Text fontSize='$5' fontWeight='bold'>
          {_prevChats.name}
        </Text>
        <Text color='$gray10' numberOfLines={1} ellipsizeMode='tail'>
          {/* {chat.message} */}
        </Text>
      </YStack>
      <Text color='$gray9' fontSize='$3'>
        {updatedAt ? dayjs(updatedAt).fromNow() : null}
      </Text>
    </XStack>
  );
};

export default UserListCard;

const styles = StyleSheet.create({});
