import React from 'react';
import { Row, Col } from 'antd';
import Chart from './Chart';
import { useParams } from 'react-router-dom';
import UserListTab from './UserListTab';
import useChats from './hooks/useChats';
import { ChatListItemInterface } from '../../types/charts';

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
      setMessage,
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
    <Row gutter={[0, 0]}>
      <Col sm={8}>
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
          }}
        />
      </Col>
      <Col sm={14}>
        <Chart
          {...{
            handleOnMessageChange,
            emojiPikerProps,
            emojiToggleRef,
            sendChatMessage,
            setAttachments,
            setMessage,
            message,
            chats,
            userId: id,
          }}
        />
      </Col>
    </Row>
  );
};

export default chartApp;
