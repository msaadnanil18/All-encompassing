import React, { useState, useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { Avatar, XStack, YStack, Input, Spinner, View, Button } from 'tamagui';
import { Send, Paperclip, Camera, Mic } from '@tamagui/lucide-icons';
import useMessage from './hook/useMessages';
import { ChatMessageInterface } from './types';
import { useRecoilValue } from 'recoil';
import { $ME } from '@AllEcompassing/components/atoms/roots';
import FileSendButton from './FileSendButton';
import { useThemeMode } from '@AllEcompassing/components/hooks/useTheme';

const ChatScreen = ({ chatId }: { chatId: string }) => {
  const [message, setMessage] = useState('');
  const onClearMessage = () => setMessage('');
  const { isDark } = useThemeMode();

  const me = useRecoilValue($ME);
  const {
    states: { chats, chatLoading, hasMore },
    actons: { handelOnSendMessage, setPage },
  } = useMessage({ chatId, userId: me?._id, onClearMessage });

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

  const messageInput = useMemo(
    () => <SendMessageInput {...{ message, setMessage, isDark }} />,
    [message],
  );
  return (
    <YStack flex={1} padding='$2'>
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
        padding='$2.5'
        borderTopWidth={1}
        borderColor='#ddd'
      >
        <FileSendButton isDark={isDark} />

        {messageInput}

        {message.trim().length > 0 ? (
          <TouchableOpacity
            onPress={() => handelOnSendMessage(message)}
            style={styles.iconButton}
          >
            <Send
              size={20}
              color={isDark ? '#EEEEEE' : '#222831'}
              marginRight='$4'
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <TouchableOpacity style={styles.iconButton}>
              <Camera
                size={18}
                marginLeft='$2'
                color={isDark ? '#EEEEEE' : '#222831'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Mic
                size={18}
                marginLeft='$5'
                marginRight='$4'
                color={isDark ? '#EEEEEE' : '#222831'}
              />
            </TouchableOpacity>
          </View>
        )}
      </XStack>
    </YStack>
  );
};

export default React.memo(ChatScreen);

const SendMessageInput: React.FC<{
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isDark: boolean;
}> = ({ message, setMessage, isDark }) => {
  const [inputHeight, setInputHeight] = useState(38);
  return (
    <TextInput
      style={[
        styles.input,
        {
          height: inputHeight,
          backgroundColor: isDark ? '#222831' : '#EEEEEE',
          color: isDark ? '#EEEEEE' : '#222831',
          borderColor: isDark ? '#222831' : '#EEEEEE',
        },
      ]}
      value={message}
      onChangeText={setMessage}
      placeholder='Type your message...'
      placeholderTextColor='#aaa'
      multiline={true}
      onContentSizeChange={(e) => {
        setInputHeight(Math.max(38, e.nativeEvent.contentSize.height));
      }}
    />
  );
};

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
  Inputcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 13,
    borderRadius: 20,
    marginLeft: 20,
    paddingHorizontal: 15,
    textAlignVertical: 'center',
    borderWidth: 1,

    shadowOffset: { width: 0, height: 1 },
  },
});
