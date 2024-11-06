import { ParamListBase } from '@react-navigation/native';

export interface RootStackParamList extends ParamListBase {
  Welcome: undefined;
  AfterLoginScreen: { userId: string };
  Chats: { userId: string };
  Messages: {
    chatId: string;
    name: string;
    avatar: string;
  };
}
