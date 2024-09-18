import React, { useState } from 'react';
import {
  Menu,
  Avatar,
  Typography,
  Button,
  Dropdown,
  Space,
  MenuProps,
  Drawer,
  Grid,
  AutoCompleteProps,
} from 'antd';

import { useNavigate } from 'react-router-dom';
import { WechatOutlined } from '@ant-design/icons';
import SearchDrawer from './SearchDrawer';
import { SearchService } from '../../services/Search';
import { ServiceErrorManager } from '../../../helpers/service';
import { User } from '../../types/partialUser';

const NavBar = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [searchValue, setSearchValue] = useState<string>();

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleSearch = async () => {
    const [err, data] = await ServiceErrorManager(
      SearchService({
        data: {
          query: { name: searchValue },
        },
      }),
      {}
    );
    if (err) return;

    setOptions(
      (data?.data || []).map((d: User) => ({
        label: (d?.name as string) || 'Unknown',
        value: (d?.name || '') as string,
      }))
    );
  };

  React.useEffect(() => {
    handleSearch();
  }, [searchValue]);
  return (
    <React.Fragment>
      <SearchDrawer
        DrawerProps={{
          open: openDrawer,
          onClose: () => {
            setOpenDrawer(false);
          },
          placement: 'left',
          width: 450,
          style: { opacity: 1, margin: 0, padding: 0 },
          title: 'New chat',
        }}
        AutoCompleteProps={{
          size: 'large',
          style: { width: '100%', margin: 0, padding: 0 },
          onSearch: (value) => setSearchValue(value),
          options: options,
        }}
      />

      <Menu
        mode="horizontal"
        style={{
          margin: 0,
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
            onClick={() => setOpenDrawer(true)}
          />
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
};

export default NavBar;
