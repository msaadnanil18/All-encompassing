import React from 'react';
import { Row, Col } from 'antd';
import Chats from './Chats';
import { useParams } from 'react-router-dom';
import UserListTab from './UserListTab';
import useChats from './hooks/useChats';

const chartApp: React.FC = () => {
  const { id } = useParams();

  const {
    actions: {
      handelOnCreateChatSelect,
      handelOnSearchChange,
      handleOnMessageChange,
      emojiPikerProps,
      emojiToggleRef,
      sendChatMessage,
      setAttachments,
    },
    states: {
      searchOptions,
      searchTerm,
      chatList,
      chatListLoading,
      message,
      chats,
    },
    togglers: {
      selectUserToChat: { openSearchBar, closeSearchBar, isOpenSearchBar },
    },
  } = useChats({ userId: id });

  return (
    <UserListTab
      {...{
        handelOnCreateChatSelect,
        openSearchBar,
        closeSearchBar,
        isOpenSearchBar,
        searchOptions,
        handelOnSearchChange,
        searchTerm,
        chatList,
        chatListLoading,
        userId: id,
        handleOnMessageChange,
        emojiPikerProps,
        emojiToggleRef,
        sendChatMessage,
        setAttachments,
        message,
        chats,
      }}
    />
  );
};

export default chartApp;
