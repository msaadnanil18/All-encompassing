import { StyleSheet, Pressable } from 'react-native';
import { View } from 'tamagui';
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

const FileSendButton = () => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const [isOpened, setIsOpened] = useState(false);

  const transYcamera = useSharedValue(0);
  const transYvideo = useSharedValue(0);
  const transYfile = useSharedValue(0);

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
    transform: [{ translateY: transYcamera.value }],
  }));

  const rVideoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: transYvideo.value }],
  }));

  const rFileStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: transYfile.value }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedPressable
        style={[
          styles.subButton,
          isOpened && rFileStyle,
          !isOpened && styles.hidden,
        ]}
      >
        <FileText marginLeft='$-3.5' size={20} color='#555' />
      </AnimatedPressable>
      <AnimatedPressable
        style={[
          styles.subButton,
          isOpened && rVideoStyle,
          !isOpened && styles.hidden,
        ]}
      >
        <VideoIcon marginLeft='$-3.5' size={20} color='#555' />
      </AnimatedPressable>
      <AnimatedPressable
        style={[
          styles.subButton,
          isOpened && rCameraStyle,
          !isOpened && styles.hidden,
        ]}
      >
        <ImageIcon marginLeft='$-3.5' size={20} color='#555' />
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
          <Cancel size={22} marginLeft='$-3.5' color='#555' />
        ) : (
          <Paperclip size={22} marginLeft='$-3.5' color='#555' />
        )}
      </Pressable>
    </View>
  );
};

export default FileSendButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainButton: {
    width: 10,
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
