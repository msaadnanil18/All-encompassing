import { ExceptionRes } from '@AllEcompassing/types/service';
import Toast from 'react-native-toast-message';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import merge from 'lodash/merge';
import Config from 'react-native-config';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

export interface ServiceOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  config?: AxiosRequestConfig<Partial<T>>;
}

export type ServiceHelper<Res, ReqData> = (
  config?: AxiosRequestConfig<ReqData>,
) => Promise<AxiosResponse<Res>>;
export const Service =
  <Res = any, ReqData = any>(
    url: string,
    options?: ServiceOptions<ReqData>,
  ): ServiceHelper<Res, ReqData> =>
  async reqConf => {
    const config = merge(options?.config || {}, reqConf);
    const token = await AsyncStorage.getItem('token');
    return axios<Res>({
      url,
      method: options?.method || 'POST',
      baseURL: Config.REACT_NATIVE_SERVER_HOST || '',
      withCredentials: true,
      ...(config || {}),
      headers: {
        Authorization: `Bearer ${token}`,
        ...(config?.headers || {}),
      },
    });
  };

export const isServiceError = (e: AxiosError<ExceptionRes>) =>
  e.response?.data && e.response.data.error;

export const handleError = (message: string) => (e: any) => {
  console.log(e);
  const description =
    isServiceError(e) && e.response ? (
      <>
        {(e.response.data.exceptions || []).map((exception: any) => (
          <Text key={exception.code}>
            {exception.message ? exception.message : exception.code}
          </Text>
        ))}
      </>
    ) : (
      'Unknown error occurred'
    );

  Toast.show({
    type: 'error',
    text1: message,
    text2: description as string,
  });
};

interface ServiceManagerOptions {
  failureMessage?: string | null;
  successMessage?: string | null;
}
export const ServiceErrorManager = async <T = any,>(
  service: Promise<
    AxiosResponse<T> | { data: T | null; error: unknown | null }
  >,
  { successMessage, failureMessage }: ServiceManagerOptions,
): Promise<any> => {
  try {
    const { data } = await service;
    if (data && successMessage) {
      Toast.show({
        type: 'success',
        text1: successMessage,
      });
    }
    return [null, data];
  } catch (e) {
    if (failureMessage) handleError(failureMessage)(e);
    return [String(e), null];
  }
};

export default Service;
