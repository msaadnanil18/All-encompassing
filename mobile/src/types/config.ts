declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_AUTH_WEB_CLIENT_ID?: string;
    REACT_NATIVE_SERVER_HOST?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
