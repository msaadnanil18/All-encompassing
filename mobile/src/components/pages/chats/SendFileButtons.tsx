import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { View } from 'tamagui';
import Animated from 'react-native-reanimated';
import {
  FileText,
  Headphones,
  Video,
  Image as ImageIcon,
} from '@tamagui/lucide-icons';
import { useFilesUpload } from '@AllEcompassing/appComponents/fileUploads/useFilesUpload';
import Modal from 'react-native-modal';
import FileReview from './FileReview';
import { UploadFileTypes } from '@AllEcompassing/appComponents/fileUploads/types';

const SendFileButtons: FC<{
  isDark: boolean;
  toggleModal: () => void;
  animatedOpenModal: StyleProp<ViewStyle>;
  animatedModalStyle: StyleProp<ViewStyle>;
  reviewAttachments: Array<UploadFileTypes>;
  setReviewAttachments: Dispatch<SetStateAction<Array<UploadFileTypes>>>;
}> = ({
  isDark,
  toggleModal,
  animatedOpenModal,
  animatedModalStyle,
  setReviewAttachments,
  reviewAttachments,
}) => {
  const { triggeredPickFiles } = useFilesUpload();
  const [loading, setLoadng] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const iconColors = isDark
    ? { image: '#FF5733', file: '#33C3FF', video: '#FFC300', music: '#C70039' }
    : { image: '#FF6F61', file: '#3498DB', video: '#F4D03F', music: '#D35400' };

  return (
    <Animated.View style={[animatedOpenModal]}>
      <View>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? '#222831' : '#EEEEEE' },
          ]}
        >
          <Animated.View style={[animatedModalStyle]}>
            <View style={styles.modalIconsContainer}>
              <TouchableOpacity
                style={{
                  ...styles.modalIcons,
                  backgroundColor: iconColors.image,
                }}
                onPress={async () => {
                  setLoadng(true);
                  setModalVisible(true);
                  const r = await triggeredPickFiles({
                    triggeredUp: 'gallery',
                  });
                  setLoadng(false);
                  setReviewAttachments(r);
                  if (!r.length) {
                    setModalVisible(false);
                  }
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
          </Animated.View>
        </View>
      </View>

      <Modal
        backdropOpacity={1}
        style={{ margin: 0, justifyContent: 'center' }}
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        propagateSwipe
        children={
          <FileReview
            setModalVisible={setModalVisible}
            reviewAttachments={reviewAttachments}
            setReviewAttachments={setReviewAttachments}
            loading={loading}
          />
        }
      />
    </Animated.View>
  );
};

export default SendFileButtons;

const styles = StyleSheet.create({
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
