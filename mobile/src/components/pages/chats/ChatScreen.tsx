import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Avatar,
  XStack,
  YStack,
  Stack,
  Separator,
  Input as TextInput,
  Spinner,
} from 'tamagui';
import { Send, Paperclip } from '@tamagui/lucide-icons';
import useMessage from './hook/useMessages';
import { ChatMessageInterface } from './types';
import { useRecoilValue } from 'recoil';
import { $ME } from '@AllEcompassing/components/atoms/roots';

const ChatScreen = ({ chatId }: { chatId: string }) => {
  const me = useRecoilValue($ME);
  const {
    states: { chats, chatLoading, message },
    actons: { setMessage, handelOnSendMessage },
  } = useMessage({ chatId, userId: me?._id });

  //   const renderMessageCard = ({ item }: { item: any }) => (
  //     <XStack space='$4' alignItems='flex-start' padding='$4'>
  //       <Avatar circular size='$4'>
  //         <Avatar.Image src={item.profileImage}></Avatar.Image>
  //       </Avatar>
  //       <YStack space='$1' flex={1}>
  //         <Text style={styles.senderText}>{item.sender}</Text>
  //         <View style={styles.messageBubble}>
  //           <Text style={styles.messageText}>{item.text}</Text>
  //         </View>
  //         <Text style={styles.timestamp}>{item.time}</Text>
  //       </YStack>
  //     </XStack>
  //   );

  const renderMessageCard = ({ item }: { item: ChatMessageInterface }) => {
    const isMyMessage = item.sender === me?._id;
    return (
      <XStack flex={1}>
        <XStack
          //   space='$4'
          flex={1}
          justifyContent={isMyMessage ? 'flex-end' : 'flex-start'}
          padding='$4'
        >
          {!isMyMessage && (
            <Avatar padding='$-0.00' margin='$-0.00' circular size='$1'>
              {/* <Avatar.Image src={item.} /> */}
            </Avatar>
          )}

          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        </XStack>
      </XStack>
    );
  };

  return (
    <YStack flex={1} padding='$4'>
      <FlatList
        data={chats}
        // ItemSeparatorComponent={() => <Separator />}
        keyExtractor={(item) => item._id || ''}
        renderItem={(item) => {
          return chatLoading ? (
            <YStack alignItems='center' padding='$10'>
              <Spinner size='large' />
            </YStack>
          ) : (
            renderMessageCard(item)
          );
        }}
        inverted
        // contentContainerStyle={{ paddingBottom: 60 }}
      />

      {/* <Separator /> */}

      <XStack
        alignItems='center'
        padding='$3'
        // backgroundColor='#f5f5f5'
        borderTopWidth={1}
        borderColor='#ddd'
      >
        <TouchableOpacity style={styles.iconButton}>
          <Paperclip size={18} marginLeft='$-5' color='#555' />
        </TouchableOpacity>
        <TextInput
          borderRadius='$10'
          fontSize={16}
          flex={1}
          color='#333'
          borderWidth={1}
          borderColor='#ddd'
          value={message}
          onChangeText={setMessage}
          placeholder='Type your message...'
          placeholderTextColor='#aaa'
        />
        {message.trim().length > 0 && (
          <TouchableOpacity
            onPress={handelOnSendMessage}
            style={styles.iconButton}
          >
            <Send size={20} color='#555' />
          </TouchableOpacity>
        )}
      </XStack>
    </YStack>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  senderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#e1ffc7',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  messageText: {
    color: '#333',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  iconButton: {
    padding: 8,
  },
});
