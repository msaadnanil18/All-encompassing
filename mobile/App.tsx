import 'react-native-reanimated';
import 'react-native-gesture-handler';
import '@AllEcompassing/types/config';
import React, { useEffect } from 'react';
import { useTheme, Text, View } from 'tamagui';
import { StatusBar } from 'react-native';
import { RecoilRoot } from 'recoil';
import { PortalProvider } from '@tamagui/portal';
import TamaguiConfig from '@AllEcompassing/components/TamaguiConfig';
import { useThemeMode } from '@AllEcompassing/components/hooks/useTheme';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { XCircle } from '@tamagui/lucide-icons';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthGuard from '@AllEcompassing/components/AuthGuard';
import Pages from '@AllEcompassing/components/pages';
const Main = () => {
  const theme = useTheme();
  const { isDark } = useThemeMode();

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(theme.accentBackground.val);
  }, [theme]);

  const toastConfig = {
    success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          backgroundColor: '#4CAF50',
          borderRadius: 10,
          paddingHorizontal: 20,
          paddingVertical: 15,
          elevation: 6,
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#FFFFFF',
        }}
      />
    ),
    failure: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          height: 40,
          width: 300,
          backgroundColor: '#fff',
          // borderTopRightRadius: 20,
          // borderBottomRightRadius: 20,
          paddingHorizontal: 10,
          borderLeftColor: '#FF5252',
          // paddingVertical: 15,
          elevation: 6,
        }}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        text1Style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000',
        }}
        renderLeadingIcon={() => (
          <View style={{ marginTop: 8, marginRight: -15 }}>
            <XCircle size={24} color='#FF6347' />
          </View>
        )}
      />
    ),
  };

  return (
    <>
      <StatusBar
        backgroundColor={theme.background.val}
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.accentBackground.val }}
      >
        <View style={{ flex: 1 }}>
          <AuthGuard>
            <Pages />
            <Toast position='top' visibilityTime={5000} config={toastConfig} />
          </AuthGuard>
        </View>
      </SafeAreaView>
    </>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <TamaguiConfig>
        <PortalProvider>
          <Main />
        </PortalProvider>
      </TamaguiConfig>
    </RecoilRoot>
  );
};

export default App;
