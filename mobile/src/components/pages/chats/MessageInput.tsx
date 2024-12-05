import React, {
  useState,
  FC,
  useImperativeHandle,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Paperclip, Camera, Send, Mic } from '@tamagui/lucide-icons';
import { useFilesUpload } from '@AllEcompassing/appComponents/fileUploads/useFilesUpload';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import SendFileButtons from './SendFileButtons';
import { UploadFileTypes } from '@AllEcompassing/appComponents/fileUploads/types';
const MessageInput: FC<{
  isDark: boolean;
  handelOnSendMessage: (R: string) => void;
  onClearInputMessageRef: any;
  attachment: Array<UploadFileTypes>;
  setAttachment: Dispatch<SetStateAction<Array<UploadFileTypes>>>;
}> = ({
  isDark,
  handelOnSendMessage,
  onClearInputMessageRef,
  attachment,
  setAttachment,
}) => {
  const [reviewAttachments, setReviewAttachments] = useState<
    Array<UploadFileTypes>
  >([]);
  const { triggeredPickFiles } = useFilesUpload();
  const [message, setMessage] = useState<string>('');
  const [inputHeight, setInputHeight] = useState(38);
  const [isModalVisible, setModalVisible] = useState(false);

  const modalOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.5);
  const modalOpenOpacity = useSharedValue(0);
  const modalOpenScale = useSharedValue(0.9);

  const toggleModal = () => {
    if (isModalVisible) {
      modalOpacity.value = withTiming(0, { duration: 300 });
      modalScale.value = withSpring(0.5, { damping: 10 });
      modalOpenOpacity.value = withTiming(0, { duration: 300 });
      modalOpenScale.value = withTiming(0.5, { duration: 300 });
      setTimeout(() => setModalVisible(false), 300);
    } else {
      setModalVisible(true);
      modalOpenOpacity.value = withTiming(1, { duration: 300 });
      modalOpenScale.value = withTiming(1, { duration: 300 });
      modalOpacity.value = withSpring(1, { damping: 10 });
      modalScale.value = withSpring(0.9, { damping: 10 });
    }
  };

  const _clear = () => setMessage('');

  useImperativeHandle(
    onClearInputMessageRef,
    () => ({
      _clear,
    }),
    [_clear],
  );

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  const animatedOpenModal = useAnimatedStyle(() => ({
    opacity: modalOpenOpacity.value,
    transform: [{ scale: modalOpenScale.value }],
  }));
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      {isModalVisible && (
        <SendFileButtons
          {...{
            isDark,
            animatedModalStyle,
            animatedOpenModal,
            toggleModal,
            reviewAttachments,
            setReviewAttachments,
          }}
        />
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          paddingRight: 40,
        }}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#222831' : '#EEEEEE',
              borderColor: isDark ? '#222831' : '#EEEEEE',
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                height: inputHeight,
                color: isDark ? '#EEEEEE' : '#222831',
              },
            ]}
            value={message}
            onChangeText={setMessage}
            placeholder='Type a message'
            placeholderTextColor='#aaa'
            multiline
            onContentSizeChange={(e) => {
              setInputHeight(Math.max(38, e.nativeEvent.contentSize.height));
            }}
          />

          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={toggleModal}>
              <Paperclip size={20} color={isDark ? '#EEEEEE' : '#222831'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                const r = await triggeredPickFiles({
                  triggeredUp: 'cameraImage',
                });
                setAttachment([r]);
              }}
            >
              <Camera size={20} color={isDark ? '#EEEEEE' : '#222831'} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity>
          {message.trim().length > 0 ? (
            <TouchableOpacity
              style={{
                ...styles.iconButton,
                backgroundColor: isDark ? '#686d6e' : '#09c4d9',
              }}
              onPress={() => handelOnSendMessage(message)}
            >
              <Send size={22} color={isDark ? '#EEEEEE' : '#222831'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                ...styles.iconButton,
                backgroundColor: isDark ? '#686d6e' : '#09c4d9',
              }}
            >
              <Mic size={22} color={isDark ? '#EEEEEE' : '#222831'} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 15,
  },
});

export default MessageInput;
