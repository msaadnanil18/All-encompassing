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
      key: '3',
      icon: <SettingOutlined />,
      label: <Typography.Text strong>Settings</Typography.Text>,
      onClick: () => navigate(`/setting--/${id}`),
    },
    {
      key: '4',
      icon: <LogoutOutlined />,
      label: <Typography.Text strong>Logout</Typography.Text>,
      onClick: logOut,
    },
  ];

  return (
    <Layout>
      <Sider
        collapsible
        defaultCollapsed={true}
        theme="light"
        width={250}
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
        <div className="demo-logo-vertical" />
        <Menu
          theme={'light'}
          style={{ ...(isDark ? { backgroundColor: ' #171717' } : {}) }}
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: isDark ? '#1f1f1f' : '#fff' }}>
            <h2>Welcome to the Dashboard</h2>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashBoard;
