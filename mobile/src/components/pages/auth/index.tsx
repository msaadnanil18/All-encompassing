import { StyleSheet } from 'react-native';
import React, { useRef, FC, ReactNode } from 'react';
import { H1, Image, Paragraph, View, YStack } from 'tamagui';
import Screen from '@AllEcompassing/components/screen/screen';
import Login from './Login';
import Video, { VideoRef } from 'react-native-video';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import { useThemeMode } from '@AllEcompassing/components/hooks/useTheme';

const FullStack: FC<{ children: ReactNode }> = ({ children }) => (
  <View
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }}
  >
    {children}
  </View>
);

const VideoSheet = () => {
  const videoRef = useRef<VideoRef>(null);

  return (
    <FullStack>
      <Video
        rate={0.7}
        source={{
          uri: 'https://res.cloudinary.com/dmkkl6bcz/video/upload/v1717054109/b9jovooitgt2bx59jzhf.mp4',
        }}
        ref={videoRef}
        style={{ width: 'auto', height: '100%' }}
        resizeMode='cover'
        repeat
        muted
      />
    </FullStack>
  );
};

const Branding = () => {
  const { isDark } = useThemeMode();

  return (
    <FullStack>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 100,
        }}
      >
        {/* <Image
          source={
            isDark
              ? require('@zarf/assets/images/zarf-banner-dark.png')
              : require('@zarf/assets/images/zarf-banner.png')
          }
          width={150}
          height={150}
          resizeMode='contain'
        /> */}
      </View>
    </FullStack>
  );
};
const Auth: FC<NativeStackScreenProps<RootStackParamList, 'Welcome'>> = () => {
  return (
    <Screen>
      <YStack
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <VideoSheet />
        <FullStack>
          <View
            style={{ flex: 1, opacity: 0.9 }}
            backgroundColor='$background'
          />
        </FullStack>
        <Login />
        <Branding />
      </YStack>
    </Screen>
  );
};

export default Auth;

const styles = StyleSheet.create({});
