import React, { useState } from 'react';
import { Button, Layout, Menu, Typography } from 'antd';
import {
  MessageOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../../thems/useDarkMode';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion'; // Import framer-motion
import Home from './Home';
const { Sider, Content } = Layout;

const DashBoard = () => {
  const isDark = useDarkMode();
  const navigate = useNavigate();
  const { id } = useParams();
  const { logOut } = useAuth();

  const menuItems = [
    {
      key: '1',
      icon: <MessageOutlined />,
      label: <Typography.Text strong>Chat</Typography.Text>,
      onClick: () => navigate(`/chat-app--/${id}`),
    },
    {
      key: '2',
      icon: <CheckCircleOutlined />,
      label: <Typography.Text strong>Project</Typography.Text>,
      onClick: () => navigate(`/todo-app--/${id}`),
    },
    {
      key: '3',
      icon: <UsergroupAddOutlined />,
      label: <Typography.Text strong>Community</Typography.Text>,
      onClick: () => navigate(`/community-app--/${id}`),
    },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: <Typography.Text strong>Settings</Typography.Text>,
      onClick: () => navigate(`/setting--/${id}`),
    },
    {
      key: '5',
      icon: <LogoutOutlined />,
      label: <Typography.Text strong>Logout</Typography.Text>,
      onClick: logOut,
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.9 }}
      >
        <Sider
          collapsible
          defaultCollapsed={true}
          theme='light'
          // width={250}
          style={{
            overflow: 'auto',
            height: '100vh',
            ...(isDark ? { backgroundColor: ' #171717' } : {}),
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            scrollbarWidth: 'thin',
            scrollbarColor: 'unset',
          }}
        >
          <div className='demo-logo-vertical' />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Menu
              theme={'light'}
              style={{ ...(isDark ? { backgroundColor: ' #171717' } : {}) }}
              mode='inline'
              defaultSelectedKeys={['1']}
              items={menuItems}
            />
          </motion.div>
        </Sider>
      </motion.div>

      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: isDark ? '#171717' : '#fff' }}>
            {/* <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to the Dashboard
            </motion.h2> */}
            <Home />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashBoard;
