import { StyleSheet, Pressable } from 'react-native';
import { Button, Image, View } from 'tamagui';
import React, { useState } from 'react';
import {
  Paperclip,
  Image as ImageIcon,
  FileText,
  Video as VideoIcon,
  X as Cancel,
} from '@tamagui/lucide-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useFilesUpload } from '@AllEcompassing/appComponents/fileUploads/useFilesUpload';
import Video, { ResizeMode, VideoRef } from 'react-native-video';
import { UploadFileTypes } from '@AllEcompassing/appComponents/fileUploads/types';
const FileSendButton: React.FC<{
  isDark: boolean;
  useFiles: (r: UploadFileTypes) => void;
}> = ({ isDark, useFiles }) => {
  const { pickFile } = useFilesUpload({ files: useFiles });
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const [isOpened, setIsOpened] = useState(false);
  const videoRef = React.useRef<VideoRef>(null);

  const transYcamera = useSharedValue(0);
  const transYvideo = useSharedValue(0);
  const transYfile = useSharedValue(0);

  const scaleCamera = useSharedValue(1);
  const scaleVideo = useSharedValue(1);
  const scaleFile = useSharedValue(1);

  const DURATION = 400;
  const TRANSLATE_Y = -60;

  const handleOnPress = () => {
    if (isOpened) {
      transYcamera.value = withTiming(0, { duration: DURATION });
      transYvideo.value = withTiming(0, { duration: DURATION });
      transYfile.value = withTiming(0, { duration: DURATION });
    } else {
      transYcamera.value = withTiming(TRANSLATE_Y, { duration: DURATION });
      transYvideo.value = withTiming(TRANSLATE_Y * 2, { duration: DURATION });
      transYfile.value = withTiming(TRANSLATE_Y * 3, { duration: DURATION });
    }
    setIsOpened(!isOpened);
  };

  const rCameraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: transYcamera.value },
      { scale: scaleCamera.value },
    ],
  }));

  const rVideoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: transYvideo.value }, { scale: scaleVideo.value }],
  }));

  const rFileStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: transYfile.value }, { scale: scaleFile.value }],
  }));

  const handlePressIn = (scaleValue: any) => {
    scaleValue.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = (scaleValue: any) => {
    scaleValue.value = withTiming(1, { duration: 100 });
  };

  return (
    <View style={styles.container}>
      {/* <Image height={30} width={30} src={file} /> */}

      <AnimatedPressable
        onPress={() => {
          pickFile([
            'application/pdf',
            '.ppt',
            '.csv',
            '.pdf',
            '.pptx',
            '.zip .gz',
            'application/vnd.ms-excel',
          ]);
        }}
        onPressIn={() => handlePressIn(scaleFile)}
        onPressOut={() => handlePressOut(scaleFile)}
        style={[
          styles.subButton,
          isOpened && rFileStyle,
          !isOpened && styles.hidden,
        ]}
      >
        <FileText
          marginLeft='$6'
          marginRight='$3'
          size={18}
          color={isDark ? '#EEEEEE' : '#222831'}
        />
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => pickFile(['video/*'])}
        onPressIn={() => handlePressIn(scaleVideo)}
        onPressOut={() => handlePressOut(scaleVideo)}
        style={[
          styles.subButton,
          isOpened && rVideoStyle,
          !isOpened && styles.hidden,
        ]}
      >
        <VideoIcon
          marginLeft='$6'
          marginRight='$3'
          size={18}
          color={isDark ? '#EEEEEE' : '#222831'}
        />
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => pickFile(['image/*'])}
        onPressIn={() => handlePressIn(scaleCamera)}
        onPressOut={() => handlePressOut(scaleCamera)}
        style={[
          styles.subButton,
          isOpened && rCameraStyle,
          !isOpened && styles.hidden,
        ]}
      >
        <ImageIcon
          marginLeft='$6'
          marginRight='$3'
          size={18}
          color={isDark ? '#EEEEEE' : '#222831'}
        />
      </AnimatedPressable>
      <Pressable
        onPress={handleOnPress}
        style={({ pressed }) =>
          pressed
            ? [styles.mainButton, { transform: [{ scale: 0.9 }] }]
            : [styles.mainButton]
        }
      >
        {isOpened ? (
          <Cancel
            size={18}
            marginLeft='$6'
            marginRight='$3'
            color={isDark ? '#EEEEEE' : '#222831'}
          />
        ) : (
          <Paperclip
            size={18}
            marginLeft='$6'
            marginRight='$3'
            color={isDark ? '#EEEEEE' : '#222831'}
          />
        )}
      </Pressable>
    </View>
  );
};

export default React.memo(FileSendButton);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainButton: {
    width: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  subButton: {
    width: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  hidden: {
    display: 'none',
  },
});
