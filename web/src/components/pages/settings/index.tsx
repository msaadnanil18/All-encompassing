import { Typography, Tabs, Grid, TabPaneProps } from 'antd';
import React, { useMemo } from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import DisplayAndTheme from './DisplayAndTheme';
import UserProfile from './UserProfile';
import { useSearchParams } from 'react-router-dom';
const { useBreakpoint } = Grid;
interface SettingsTabs extends TabPaneProps {
  key: string;
  label: React.ReactNode;
}
const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handelOnTabsChange = (newActiveKey: string) => {
    setSearchParams({ tab: newActiveKey });
  };
  const screen = useBreakpoint();
  const settingsTabs: SettingsTabs[] = useMemo(
    () => [
      {
        key: 'displayAndTheme',
        label: <Typography.Text>Display Theme</Typography.Text>,
        icon: <SettingOutlined style={{ fontSize: '16px' }} />,
        children: <DisplayAndTheme />,
      },
      {
        key: 'profile',
        label: <Typography.Text>Profile</Typography.Text>,
        icon: <UserOutlined style={{ fontSize: '16px' }} />,
        children: <UserProfile />,
      },
    ],
    []
  );
  return (
    <div className='p-2 flex flex-col'>
      <div className='p-2 md:p-2'>
        <Typography.Title level={3}>Settings</Typography.Title>
        <Tabs
          type='line'
          tabBarStyle={{
            width: screen.xs ? '100%' : '10rem',
          }}
          tabPosition={screen.xs ? 'top' : 'left'}
          activeKey={searchParams.get('tab') || 'displayAndTheme'}
          items={settingsTabs}
          onChange={handelOnTabsChange}
        />
      </div>
    </div>
  );
};

export default Settings;
