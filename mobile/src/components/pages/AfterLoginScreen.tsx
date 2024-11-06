import { StyleSheet } from 'react-native';
import { Button, Text, View } from 'tamagui';
import React, { FC } from 'react';
import { useAuth } from './auth/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@AllEcompassing/types/screens';
import DashBoard from './dashBoard';
const AfterLoginScreen: FC<NativeStackScreenProps<RootStackParamList>> = (
  props,
) => {
  return <DashBoard {...props} />;
};

export default AfterLoginScreen;

const styles = StyleSheet.create({});
