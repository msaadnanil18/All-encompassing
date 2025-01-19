import React, { FC, useState } from 'react';
import { Button, Layout, Menu, Modal, Space, Typography } from 'antd';
import {
  MessageOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../../thems/useDarkMode';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import Home from './Home';
import { darkModeColors, getBackgroundColor } from '../../utills';

const { Sider, Content } = Layout;

const DashBoard: FC = () => {
  const [logOutLoading, setLogOutLoading] = useState<boolean>(false);
  const isDark = useDarkMode();
  const navigate = useNavigate();
  const { id } = useParams();
  const { logOut } = useAuth();
  const [modal, contextHolder] = Modal.useModal();

  const handelOnLogOut = async () => {
    setLogOutLoading(true);
    await logOut();
    setLogOutLoading(false);
  };

  const confirm = () => {
    modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to logout',
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { loading: logOutLoading },
      onOk: async () => await handelOnLogOut(),
    });
  };

  const menuItems = [
    {
      key: '1',
      icon: <MessageOutlined />,
      label: <label className=' font-semibold'>Chat</label>,
      onClick: () => navigate(`/chat-app--/${id}`),
    },
    {
      key: '2',
      icon: <CheckCircleOutlined />,
      label: <label className=' font-semibold'>Project</label>,
      onClick: () => navigate(`/todo-app--/${id}`),
    },
    {
      key: '3',
      icon: <UsergroupAddOutlined />,
      label: <label className=' font-semibold'>Community</label>,
      onClick: () => navigate(`/community-app--/${id}`),
    },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: <label className=' font-semibold'>Settings</label>,
      onClick: () => navigate(`/setting--/${id}`),
    },
    {
      key: '5',
      icon: <LogoutOutlined />,
      label: <label className=' font-semibold'>Logout</label>,
      onClick: () => confirm(),
    },
  ];

  const p = <T extends {}>(t: Array<T>) => {
    return t[0];
  };

  return (
    <Layout>
      {contextHolder}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Sider
          collapsible
          defaultCollapsed={true}
          theme='light'
          // width={250}
          style={{
            overflow: 'auto',
            height: '100vh',
            ...(isDark ? { backgroundColor: darkModeColors.background } : {}),
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
              style={{
                ...(isDark
                  ? { backgroundColor: darkModeColors.background }
                  : {}),
              }}
              mode='inline'
              defaultSelectedKeys={['1']}
              items={menuItems}
            />
          </motion.div>
        </Sider>
      </motion.div>

      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: getBackgroundColor(isDark) }}>
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
