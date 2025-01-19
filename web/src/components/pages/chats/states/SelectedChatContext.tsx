import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  FC,
} from 'react';
import { ChatListItem } from '../types';

interface SelectChatContextType {
  selectedChat: ChatListItem | null;
  setSelectedChat: Dispatch<SetStateAction<ChatListItem | null>>;
}

const SelectChatContext = createContext<SelectChatContextType | null>(null);

export const ChatProvider: FC<{ childern: ReactNode }> = ({ childern }) => {
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  return (
    <SelectChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {childern}
    </SelectChatContext.Provider>
  );
};

export const useChatProvider = (): SelectChatContextType => {
  const context = useContext(SelectChatContext);
  if (!context) {
    throw new Error();
  }
  return context;
};
