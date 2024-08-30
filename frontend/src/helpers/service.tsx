import { ExceptionRes } from '../components/types/service';
import { notification, Typography } from 'antd';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { merge } from 'lodash-es';

const { Text } = Typography;

export interface ServiceOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  config?: AxiosRequestConfig<Partial<T>>;
}

export type ServiceHelper<Res, ReqData> = (
  config?: AxiosRequestConfig<ReqData>
) => Promise<AxiosResponse<Res>>;
export const Service =
  <Res = any, ReqData = any>(
    url: string,
    options?: ServiceOptions<ReqData>
  ): ServiceHelper<Res, ReqData> =>
  (reqConf) => {
    const config = merge(options?.config || {}, reqConf);
    return axios<Res>({
      url,
      method: options?.method || 'POST',
      baseURL: 'http://localhost:3001' || import.meta.env.VITE_SERVER_URI || '',
      withCredentials: true,
      ...(config || {}),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
          <div>
            {e.message ? (
              <Text>{exception.message}</Text>
            ) : (
              <Text type="secondary">{exception.code}</Text>
            )}
          </div>
        ))}
      </>
    ) : (
      'Unknown error occurred'
    );

  notification.error({ message, description });
};

interface ServiceManagerOptions {
  failureMessage?: string | null;
  successMessage?: string | null;
}
export const ServiceErrorManager = async <T = any,>(
  service: Promise<
    AxiosResponse<T> | { data: T | null; error: unknown | null }
  >,
  { successMessage, failureMessage }: ServiceManagerOptions
): Promise<any> => {
  try {
    const { data } = await service;
    if (data && successMessage) {
      notification.success({ message: successMessage });
    }
    return [null, data];
  } catch (e) {
    if (failureMessage) handleError(failureMessage)(e);
    return [String(e), null];
  }
};

export default Service;
