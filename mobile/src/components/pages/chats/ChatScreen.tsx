import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Avatar, XStack, YStack, Input as TextInput, Spinner } from 'tamagui';
import { Send, Paperclip } from '@tamagui/lucide-icons';
import useMessage from './hook/useMessages';
import { ChatMessageInterface } from './types';
import { useRecoilValue } from 'recoil';
import { $ME } from '@AllEcompassing/components/atoms/roots';
import FileSendButton from './FileSendButton';

const ChatScreen = ({ chatId }: { chatId: string }) => {
  const me = useRecoilValue($ME);
  const {
    states: { chats, chatLoading, message, hasMore },
    actons: { setMessage, handelOnSendMessage, setPage },
  } = useMessage({ chatId, userId: me?._id });

  const renderFooter = () => {
    if (!chatLoading) return null;
    return (
      <YStack alignItems='center' padding='$10'>
        <Spinner size='large' />
      </YStack>
    );
  };

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
        keyExtractor={(item) => item._id || ''}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={renderMessageCard}
        inverted
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (hasMore && !chatLoading) {
            setPage((prevPage) => prevPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
      />

      <XStack
        alignItems='center'
        padding='$3'
        borderTopWidth={1}
        borderColor='#ddd'
      >
        <FileSendButton />
        {/* <TouchableOpacity style={styles.iconButton}>
          <Paperclip size={18} marginLeft='$-5' color='#555' />
        </TouchableOpacity> */}
        <TextInput
          borderRadius='$10'
          fontSize={14}
          flex={1}
          color='#333'
          size='$3'
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
    marginRight: -20,
    padding: 6,
  },
});
