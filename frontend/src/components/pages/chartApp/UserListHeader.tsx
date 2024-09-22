import React, { useState } from 'react';
import { Menu, Typography, Button, AutoCompleteProps, Avatar } from 'antd';
import { UserOutlined, WechatOutlined } from '@ant-design/icons';
import SearchDrawer from '../home/SearchDrawer';
import { User } from '../../types/partialUser';
export const RenderItem: React.FC<{ resource: User; index: number }> = ({
  resource,
  index,
}) => {
  console.log(resource);
  const _resource = { ...resource };
  if (!_resource?.avatar) {
    _resource.avatar = `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`;
  }

  return (
    <div key={_resource._id}>
      <div>
        <Avatar src={_resource.avatar} size={40} icon={<UserOutlined />} />
        <Typography.Text strong> {_resource.name}</Typography.Text>
      </div>
    </div>
  );
};
const UserListHeader: React.FC<{
  searchTerm: string;
  isDark: boolean;
  searchOptions: AutoCompleteProps['options'];
  handelOnCreateChatSelect: (r: string) => Promise<void>;
  closeSearchBar: () => void;
  isOpenSearchBar: boolean;
  openSearchBar: () => void;
  handelOnSearchChange: (r: string) => void;
}> = ({
  isDark,
  handelOnCreateChatSelect,
  isOpenSearchBar,
  closeSearchBar,
  openSearchBar,
  searchOptions,
  handelOnSearchChange,
  searchTerm,
}) => {
  return (
    <React.Fragment>
      <SearchDrawer
        DrawerProps={{
          open: isOpenSearchBar,
          onClose: closeSearchBar,
          placement: 'left',
          width: 450,
          style: { opacity: 1, margin: 0, padding: 0 },
          title: 'New chat',
        }}
        AutoCompleteProps={{
          className: 'w-full text-lg',
          placeholder: 'Search User ...',
          variant: 'borderless',
          size: 'large',
          style: {
            width: '100%',
            margin: 0,
            padding: 0,
            outline: 'none',
            border: 'nones',
          },
          value: searchTerm,
          onSearch: handelOnSearchChange,
          options: searchOptions,
          onSelect: handelOnCreateChatSelect,
        }}
      />

      <Menu
        mode="horizontal"
        style={{
          margin: 0,
          ...(isDark ? { backgroundColor: ' #171717' } : {}),
          border: 'none',
          padding: 0,
          width: '100%',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Menu.Item key="chats" disabled>
          <Button style={{ margin: 0, padding: 0 }} type="link" danger>
            <Typography.Title level={5} style={{ margin: 0 }}>
              Chats
            </Typography.Title>
          </Button>
        </Menu.Item>
        <Menu.Item key="open-drawer">
          <Button
            style={{ margin: 0, padding: 0 }}
            type="link"
            icon={<WechatOutlined style={{ fontSize: '22px' }} />}
            onClick={openSearchBar}
          />
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
};

export default UserListHeader;
