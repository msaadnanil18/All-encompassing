import 'react-native-reanimated';
import 'react-native-gesture-handler';
import '@AllEcompassing/types/config';
import React, { useEffect, useState, useCallback } from 'react';
import { useTheme, Text, View, Spinner } from 'tamagui';
import { StatusBar } from 'react-native';
import { RecoilRoot } from 'recoil';
import { PortalProvider } from '@tamagui/portal';
import TamaguiConfig from '@AllEcompassing/components/TamaguiConfig/TamaguiConfig';
import { useThemeMode } from '@AllEcompassing/components/hooks/useTheme';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { XCircle } from '@tamagui/lucide-icons';
import Toast, { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthGuard from '@AllEcompassing/components/AuthGuard';
import Screens from '@AllEcompassing/components/screen';
import { User } from '@AllEcompassing/types/partialUser';
import { InitService } from '@AllEcompassing/components/Services/auth';
import { $ME, $THEME_C0NFIG } from '@AllEcompassing/components/atoms/roots';
import { ServiceErrorManager } from '@AllEcompassing/helpers/service';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);

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
            <Screens />
            <Toast position='top' visibilityTime={5000} config={toastConfig} />
          </AuthGuard>
        </View>
      </SafeAreaView>
    </>
  );
};

const App = () => {
  const [init, setInit] = useState<User | null>(null);
  const [loading, setLoding] = React.useState<boolean>(false);

  const initializeApp = useCallback(async function () {
    setLoding(true);
    await ServiceErrorManager(InitService(), {})
      .then(([_, data]) => setInit(data?.data))
      .finally(() => {
        setLoding(false);
      });
  }, []);

  useEffect(() => {
    initializeApp().catch(console.log);
  }, []);

  if (loading)
    return (
      <View>
        <Spinner />
      </View>
    );
  return (
    <RecoilRoot
      initializeState={({ set }) => {
        set($ME, init || null);
        set($THEME_C0NFIG, (init?.themConfig as any) || null);
      }}
    >
      <TamaguiConfig>
        <PortalProvider>
          <Main />
        </PortalProvider>
      </TamaguiConfig>
    </RecoilRoot>
  );
};

export default App;
