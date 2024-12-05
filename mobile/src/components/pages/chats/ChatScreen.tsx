import React, { useState, useMemo, useRef, FC } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Avatar, XStack, YStack, Spinner, View, Text } from 'tamagui';
import useMessage from './hook/useMessages';
import { ChatMessageInterface } from './types';
import { useRecoilValue } from 'recoil';
import { $ME } from '@AllEcompassing/components/atoms/roots';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import { useThemeMode } from '@AllEcompassing/components/hooks/useTheme';
import MessageInput from './MessageInput';
import RNFS from 'react-native-fs';
import { UploadFileTypes } from '@AllEcompassing/appComponents/fileUploads/types';

const ChatScreen: FC<
  NativeStackScreenProps<RootStackParamList, 'Messages'>
> = ({ route, navigation }) => {
  const { chatId } = route.params;
  const onClearInputMessageRef = useRef<any>();
  const onClearMessage = () => onClearInputMessageRef.current._clear();
  const [attachment, setAttachment] = useState<Array<UploadFileTypes>>([]);
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
        <MessageInput
          {...{
            handelOnSendMessage,
            isDark,
            onClearInputMessageRef,
            attachment,
            setAttachment,
          }}
        />
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
    // marginRight: -10,
    // padding: 6,
    marginBottom: 5,
  },
  Inputcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 13,
    borderRadius: 20,
    marginLeft: 27,
    paddingHorizontal: 15,
    textAlignVertical: 'center',
    borderWidth: 1,

    shadowOffset: { width: 0, height: 1 },
  },
});
