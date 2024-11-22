import React, { Ref } from 'react';
import { Layout, List, Avatar, Grid, AutoCompleteProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserListHeader from './UserListHeader';
import { useDarkMode } from '../../thems/useDarkMode';
const { Content, Sider } = Layout;
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chats from './Chats';
import useChats from './hooks/useChats';

const UserListTab: React.FC<{
  userId: string | undefined;
}> = ({ userId }) => {
  const {
    actions: {
      handelOnCreateChatSelect,
      handelOnSearchChange,
      handleOnMessageChange,
      emojiPikerProps,
      emojiToggleRef,
      sendChatMessage,
      setAttachments,
      setMessageEditId,
      handelOnDeleteMessage,
      form,
    },
    states: {
      searchOptions,
      searchTerm,
      chatList,
      chatListLoading,

      chats,
      chatLoading,
      containerRef,
    },
    togglers: {
      selectUserToChat: { openSearchBar, closeSearchBar, isOpenSearchBar },
    },
  } = useChats({ userId });

  const isDark = useDarkMode();
  const [_, setSearchParams] = useSearchParams();

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
    flexShrink: 0,
    boxSizing: 'border-box',
    ...(isDark ? { backgroundColor: ' #171717' } : {}),
  };

  const contentStyle: React.CSSProperties = {
    overflowY: 'auto',
    overflowX: 'hidden',
    flex: 1,
    minWidth: 0,
    boxSizing: 'border-box',
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      (containerRef.current as any).scrollTop = (
        containerRef.current as any
      ).scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chats]);
  return (
    <Layout style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sider theme='light' width={455} style={siderStyle}>
        <List
          loading={chatListLoading}
          header={
            <UserListHeader
              {...{
                isDark,
                handelOnCreateChatSelect,
                isOpenSearchBar,
                closeSearchBar,
                openSearchBar,
                searchOptions,
                handelOnSearchChange,
                searchTerm,
              }}
            />
          }
          itemLayout='horizontal'
          dataSource={chatList}
          renderItem={(chat, index) => {
            const prevChats = chat.members.find((user) => user._id !== userId);
            let _prevChats = { ...prevChats };
            if (!prevChats?.avatar) {
              _prevChats.avatar = `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`;
            }
            return (
              <motion.div
                initial={{ opacity: 0, x: '-100%' }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <List.Item
                  onClick={() => {
                    setSearchParams({
                      name: chat.name.split('-')[1],
                      id: chat._id,
                    });
                  }}
                  style={{ cursor: 'pointer', padding: '10px 15px' }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={50}
                        src={_prevChats?.avatar}
                        icon={<UserOutlined />}
                      />
                    }
                    title={_prevChats?.name}
                    description={_prevChats?.email}
                  />
                </List.Item>
              </motion.div>
            );
          }}
        />
      </Sider>

      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <Content
          //@ts-ignore
          ref={containerRef}
          style={contentStyle}
        >
          <div style={{ textAlign: 'center' }}>
            <Chats
              {...{
                handleOnMessageChange,
                emojiPikerProps,
                emojiToggleRef,
                sendChatMessage,
                setAttachments,
                form,
                chats,
                userId,
                chatLoading,
                setMessageEditId,
                handelOnDeleteMessage,
              }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserListTab;
