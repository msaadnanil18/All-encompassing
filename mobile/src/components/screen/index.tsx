import { StyleSheet } from 'react-native';
import Pages from '../pages';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

const Screens = () => {
  return (
    <NavigationContainer>
      <Pages />
    </NavigationContainer>
  );
};

export default Screens;

const styles = StyleSheet.create({});
