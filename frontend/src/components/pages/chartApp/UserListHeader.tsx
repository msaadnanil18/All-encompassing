import React, { useState } from 'react';
import { Menu, Typography, Button, AutoCompleteProps } from 'antd';
import { WechatOutlined } from '@ant-design/icons';
import SearchDrawer from '../home/SearchDrawer';
import { User } from '../../types/partialUser';
export const RenderItem: React.FC<{ resource: User }> = ({ resource }) => (
  <div key={resource._id}>
    <p className="p-0 m-0">{resource.name}</p>
    <p className="text-sm m-0 p-0">{resource.email}</p>
  </div>
);
const UserListHeader: React.FC<{
  isDark: boolean;
  searchOptions: AutoCompleteProps['options'];
  handelOnCreateCharSelect: (r: string) => void;
  closeSearchBar: () => void;
  isOpenSearchBar: boolean;
  openSearchBar: () => void;
  handelOnSearchChange: (r: string) => void;
}> = ({
  isDark,
  handelOnCreateCharSelect,
  isOpenSearchBar,
  closeSearchBar,
  openSearchBar,
  searchOptions,
  handelOnSearchChange,
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
          onSearch: handelOnSearchChange,
          options: searchOptions,
          onSelect: handelOnCreateCharSelect,
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
