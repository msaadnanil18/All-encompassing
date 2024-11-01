import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Input,
  Form,
  H4,
  Button,
  Spinner,
  XStack,
  Stack,
} from 'tamagui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from './useAuth';

const Login = () => {
  const { login, loading, me } = useAuth();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Please enter your username'),
    password: Yup.string().required('Please enter your password'),
  });
  const initialValues = {
    username: '',
    password: '',
  };

  const onSubmit = async (value: Record<string, any>) => {
    await login(value);
  };
  return (
    <XStack>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <Stack
            space='$4'
            padding='$5'
            backgroundColor='$background'
            alignItems='center'
            width='100%'
          >
            <Text fontSize='$5' fontWeight='bold'>
              Login
            </Text>
            {loading ? (
              <Spinner />
            ) : (
              <Stack width='100%' space='$4'>
                <Input
                  value={values.username}
                  onChangeText={handleChange('username')}
                  placeholder='Username'
                  onBlur={handleBlur('username')}
                  width='100%'
                  borderWidth={1}
                  borderColor='$borderColor'
                  borderRadius='$4'
                  paddingHorizontal='$3'
                />
                <Input
                  placeholder='Password'
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  width='100%'
                  borderWidth={1}
                  borderColor='$borderColor'
                  borderRadius='$4'
                  paddingHorizontal='$3'
                />
                <Button
                  onPress={() => handleSubmit()}
                  backgroundColor='$backgroundFocus'
                  width='100%'
                  padding='$1'
                  disabled={loading}
                >
                  <Text color='$white'>Login</Text>
                </Button>
              </Stack>
            )}
          </Stack>
        )}
      </Formik>
    </XStack>
  );
};

export default Login;

const styles = StyleSheet.create({});
