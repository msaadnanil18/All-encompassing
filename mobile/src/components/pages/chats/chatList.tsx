import React, { useRef } from 'react';
import { View, Text, Stack, YStack, Separator, Button, Spinner } from 'tamagui';
import { TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import useChats from './hook/useChats';
import { Search } from '@tamagui/lucide-icons';
import NewUserListDrawer from './NewUserListDrawer';
import UserListCard from './UserListCard';
import { ChatListItemInterface } from './types';
import { User } from '@AllEcompassing/types/partialUser';

type ChatListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ChatList = () => {
  const refRBSheet = useRef<any>(null);
  const navigation = useNavigation<ChatListNavigationProp>();
  const route = useRoute();
  const userId = (route.params as { userId: string }).userId;
  const { states } = useChats({ userId });

  const { chatList, chatListLoading } = states;

  const navigateToChat = (chat: ChatListItemInterface, chatUser: User) => {
    navigation.navigate('Messages', {
      chatId: chat._id,
      name: chatUser.name,
      avatar: chatUser.avatar,
    });
  };

  if (chatListLoading) {
    return (
      <YStack alignItems='center' padding='$10'>
        <Spinner size='large' />
      </YStack>
    );
  }

  if (!(chatList || []).length) {
    return (
      <YStack flex={1}>
        <Button
          padding='$5'
          flexDirection='row'
          justifyContent='flex-end'
          onPress={() => refRBSheet.current?.open()}
          icon={<Search size='$1.5' />}
        />
        <Stack
          flex={1}
          alignItems='center'
          justifyContent='center'
          padding='$6'
        >
          <Text
            fontSize='$6'
            fontWeight='bold'
            color='$gray9'
            marginBottom='$3'
          >
            No Chats Available
          </Text>
          <Text
            color='$gray10'
            textAlign='center'
            paddingHorizontal='$4'
            fontSize='$4'
          >
            Start a new conversation or wait for messages to appear here.
          </Text>
        </Stack>
        <NewUserListDrawer refRBSheet={refRBSheet} userId={userId} />
      </YStack>
    );
  }

  return (
    <Stack space='$4' padding='$4'>
      <View style={styles.headerContainer}>
        <Text fontSize='$5' fontWeight='bold' marginBottom='$4'>
          Chats
        </Text>
        <Button
          onPress={() => refRBSheet.current?.open()}
          icon={<Search size='$1.5' />}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ right: 10 }}
        style={styles.ScrollViewContainer}
      >
        {(chatList || []).map((chat, index) => {
          const prevChat = chat.members.find((user) => user._id !== userId);
          let _prevChats = { ...prevChat };
          if (!prevChat.avatar) {
            _prevChats.avatar = `https://randomuser.me/api/portraits/men/${index}.jpg`;
          }

          return (
            <TouchableOpacity
              key={prevChat._id}
              onPress={() => navigateToChat(chat, _prevChats)}
            >
              <Stack alignItems='center'>
                <UserListCard
                  _prevChats={_prevChats}
                  updatedAt={chat.updatedAt}
                />
                <Separator
                  alignSelf='stretch'
                  vertical
                  shadowColor='$blue10Light'
                  marginVertical='$3'
                />
              </Stack>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <NewUserListDrawer refRBSheet={refRBSheet} userId={userId} />
    </Stack>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ScrollViewContainer: {
    marginBottom: 30,
  },
});
