import React from 'react';
import { Layout, List, Avatar, Grid, AutoCompleteProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserListHeader from './UserListHeader';
import { useDarkMode } from '../../thems/useDarkMode';
import { ChatListItemInterface } from '../../types/charts';
const { useBreakpoint } = Grid;
const { Sider } = Layout;
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserListTab: React.FC<{
  handelOnCreateChatSelect: (r: string) => Promise<void>;
  isOpenSearchBar: boolean;
  searchTerm: string;
  closeSearchBar: () => void;
  openSearchBar: () => void;
  searchOptions: AutoCompleteProps['options'];
  handelOnSearchChange: (r: string) => void;
  chatList: ChatListItemInterface[];
  chatListLoading: boolean;
  userId: string | undefined;
}> = ({
  handelOnCreateChatSelect,
  isOpenSearchBar,
  closeSearchBar,
  openSearchBar,
  searchOptions,
  handelOnSearchChange,

  searchTerm,
  chatListLoading,
  chatList,
  userId,
}) => {
  const isDark = useDarkMode();
  const [_, setSearchParams] = useSearchParams();

  return (
    <Layout>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Sider
          theme="light"
          width={455}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            insetInlineStart: 0,
            ...(isDark ? { backgroundColor: ' #171717' } : {}),
            top: 0,
            bottom: 0,
            scrollbarWidth: 'thin',
            scrollbarColor: 'auto',
          }}
        >
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
            itemLayout="horizontal"
            dataSource={chatList}
            renderItem={(chat, index) => {
              const prevChats = chat.members.find(
                (user) => user._id !== userId
              );
              let _prevChats = { ...prevChats };
              if (!prevChats?.avatar) {
                _prevChats.avatar = `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`;
              }
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <List.Item
                    onClick={(e) => {
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
      </motion.div>
    </Layout>
  );
};

export default UserListTab;
