import React, { useState } from 'react';
import { Layout, List, Avatar, Card, Button } from 'antd';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import UserListHeader from './UserListHeader';
import { useDarkMode } from '../../thems/useDarkMode';
import useChats from './hooks/useChats';
import Chats from './Chats';
import { reverse, sortBy } from 'lodash-es';
import EmojiPiker from '../../emojiPicker/EmojiPiker';
import DriveFileUpload from '../../../driveFileUpload';
import MessageInput from './MessageInput';
import MessageSendButton from './MessageSendButton';
import { addFiles } from '../../types/addFiles';

const { Content, Sider } = Layout;

const UserListTab: React.FC<{
  userId: string | undefined;
}> = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [_attachments, set_Attachments] = useState<addFiles[]>([]);
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

  const [searchParams, setSearchParams] = useSearchParams();

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
    scrollbarWidth: 'thin',
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

  const handelOnAttachments = <t extends addFiles>(file: t[]) => {
    set_Attachments(file);
    setAttachments(file);
    setIsModalOpen(true);
  };
  return (
    <Layout style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sider theme='light' width={400} style={siderStyle}>
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
          dataSource={reverse(sortBy(chatList, 'updatedAt'))}
          renderItem={(chat, index) => {
            const prevChats = chat.members.find((user) => user._id !== userId);
            let _prevChats = { ...prevChats };
            if (!prevChats?.avatar) {
              _prevChats.avatar = `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`;
            }

            const isSelected = searchParams.get('id') === chat._id;

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
                  style={{
                    cursor: 'pointer',
                    padding: '10px 15px',
                    backgroundColor: isSelected
                      ? isDark
                        ? '#403b3b'
                        : '#e6e0d8'
                      : undefined,
                    // borderLeft: isSelected
                    //   ? '4px solid #1890ff'
                    //   : '4px solid transparent',
                  }}
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
                sendChatMessage,
                form,
                chats,
                userId,
                chatLoading,
                setMessageEditId,
                handelOnDeleteMessage,
                _attachments,
                isModalOpen,
                setIsModalOpen,
              }}
            />
          </div>
        </Content>

        {searchParams.get('id') && (
          <>
            <div>
              <EmojiPiker {...emojiPikerProps} />
            </div>
            <div>
              <Card
                style={{
                  backgroundColor: isDark ? '#171717' : '#f0f2f5',
                  width: '100%',
                }}
              >
                <div className='flex items-center space-x-3'>
                  <DriveFileUpload chooseFiles={handelOnAttachments} />

                  <Button
                    type='text'
                    shape='circle'
                    icon={<SmileOutlined style={{ fontSize: '20px' }} />}
                    onClick={() => {
                      if ((emojiToggleRef as any).current) {
                        (emojiToggleRef as any).current.toggle();
                      }
                    }}
                  />

                  <MessageInput {...{ form, sendChatMessage }} />
                </div>
              </Card>
            </div>
          </>
        )}
      </Layout>
    </Layout>
  );
};

export default UserListTab;
