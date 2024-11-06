import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import AfterLoginScreen from './AfterLoginScreen';
import React from 'react';
import Auth from './auth';
import Chats from './chats/Index';
import MessagesList from './chats/MessagesList';
import { useRecoilValue } from 'recoil';
import { $ME } from '../atoms/roots';
import { Text, View } from 'tamagui';
import MessageHeaderFactory from './chats/MessageHeaderFactory';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Pages = () => {
  const me = useRecoilValue($ME);

  return (
    <Stack.Navigator initialRouteName={me ? 'AfterLoginScreen' : 'Welcome'}>
      <Stack.Screen
        name='Welcome'
        options={{ headerShown: false }}
        component={Auth}
      />
      <Stack.Screen
        name='AfterLoginScreen'
        options={{ headerShown: false }}
        component={AfterLoginScreen}
        {...(me ? { initialParams: { userId: me._id } } : {})}
      />
      <Stack.Screen
        name='Chats'
        options={{ headerShown: false }}
        component={Chats}
      />
      <Stack.Screen
        options={({ route }) => ({
          header: MessageHeaderFactory,
        })}
        name='Messages'
        component={MessagesList}
      />
    </Stack.Navigator>
  );
};

export default Pages;

const styles = StyleSheet.create({});
