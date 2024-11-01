import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Auth from './auth';
const Stack = createNativeStackNavigator<RootStackParamList>();
const Pages = () => {
  return (
    <Stack.Navigator initialRouteName={'Welcome'}>
      <Stack.Screen
        name='Welcome'
        options={{ headerShown: false }}
        component={Auth}
      />
    </Stack.Navigator>
  );
};

export default Pages;

const styles = StyleSheet.create({});
