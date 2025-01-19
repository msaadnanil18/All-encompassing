import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ChatListItem } from '../types';

export interface ChatState {
  chatList: ChatListItem[];
}

export interface ChatAction {
  type: 'SET_CHAT_LIST' | 'ADD_CHAT' | 'REMOVE_CHAT' | 'UPDATE_CHAT';
  payload: ChatListItem | ChatListItem[] | string;
}

const initialState: ChatState = { chatList: [] };

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CHAT_LIST':
      return { ...state, chatList: action.payload as ChatListItem[] };
    case 'ADD_CHAT':
      return {
        ...state,
        chatList: [...state.chatList, action.payload as ChatListItem],
      };
    case 'REMOVE_CHAT':
      return {
        ...state,
        chatList: state.chatList.filter(
          (chat) => chat._id !== (action.payload as string)
        ),
      };
    case 'UPDATE_CHAT':
      const updatedChat = action.payload as ChatListItem;
      return {
        ...state,
        chatList: state.chatList.map((chat) =>
          chat._id === updatedChat._id ? updatedChat : chat
        ),
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useContextChat = () => useContext(ChatContext);
