import React, { useState, FC, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Paperclip,
  Camera,
  Send,
  Mic,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Headphones,
} from '@tamagui/lucide-icons';
import { useFilesUpload } from '@AllEcompassing/appComponents/fileUploads/useFilesUpload';

const MessageInput: FC<{
  isDark: boolean;
  handelOnSendMessage: (R: string) => void;
  onClearInputMessageRef: any;
}> = ({ isDark, handelOnSendMessage, onClearInputMessageRef }) => {
  const [message, setMessage] = useState<string>('');
  const [inputHeight, setInputHeight] = useState(38);
  const [isModalVisible, setModalVisible] = useState(false);

  const _clear = () => setMessage('');
  const { triggeredPickFiles } = useFilesUpload();
  useImperativeHandle(
    onClearInputMessageRef,
    () => ({
      _clear,
    }),
    [_clear],
  );
  const iconColors = isDark
    ? { image: '#FF5733', file: '#33C3FF', video: '#FFC300', music: '#C70039' }
    : { image: '#FF6F61', file: '#3498DB', video: '#F4D03F', music: '#D35400' };

  const toggleModal = () => setModalVisible((prev) => !prev);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#222831' : '#EEEEEE' },
            ]}
          >
            <View style={styles.modalIconsContainer}>
              <TouchableOpacity
                style={{
                  ...styles.modalIcons,
                  backgroundColor: iconColors.image,
                }}
                onPress={async () => {
                  const r = await triggeredPickFiles({
                    triggeredUp: 'gallery',
                  });
                  console.log(r, 'rrrr');
                }}
              >
                <ImageIcon size={24} color={isDark ? '#EEEEEE' : '#222831'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.modalIcons,
                  backgroundColor: iconColors.file,
                }}
                onPress={async () => {
                  const file = await triggeredPickFiles({
                    triggeredUp: 'file',
                    fileType: [
                      'application/pdf',
                      '.ppt',
                      '.csv',
                      '.pdf',
                      '.pptx',
                      '.zip .gz',
                      'application/vnd.ms-excel',
                      'image/*',
                      'audio/*',
                      'video/*',
                    ],
                  });
                  console.log(file, '____files___');
                }}
              >
                <FileText size={24} color={isDark ? '#EEEEEE' : '#222831'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.modalIcons,
                  backgroundColor: iconColors.video,
                }}
                onPress={async () =>
                  await triggeredPickFiles({ triggeredUp: 'cameraVideo' })
                }
              >
                <Video size={24} color={isDark ? '#EEEEEE' : '#222831'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.modalIcons,
                  backgroundColor: iconColors.music,
                }}
                onPress={async () =>
                  await triggeredPickFiles({
                    triggeredUp: 'file',
                    fileType: ['audio/*'],
                  })
                }
              >
                <Headphones size={24} color={isDark ? '#EEEEEE' : '#222831'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
            <TouchableOpacity onPress={() => setModalVisible((r) => !r)}>
              <Paperclip size={20} color={isDark ? '#EEEEEE' : '#222831'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () =>
                await triggeredPickFiles({ triggeredUp: 'cameraImage' })
              }
            >
              <Camera size={20} color={isDark ? '#EEEEEE' : '#222831'} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
        // onPress={() =>
        //   message.trim()
        //     ? console.log('Message Sent:', message)
        //     : console.log('Mic Activated')
        // }
        >
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
  modalOverlay: {},
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: -10,
    marginBottom: 10,
    marginTop: 10,
  },
  modalIcons: {
    borderRadius: 35,
    padding: 20,
  },
  modalIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
});

export default React.memo(MessageInput);
