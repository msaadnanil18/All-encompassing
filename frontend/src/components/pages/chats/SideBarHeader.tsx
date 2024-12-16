import React, { FC, Dispatch, SetStateAction } from 'react';
import {
  MoreOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Breakpoint,
  Dropdown,
  FormInstance,
  Input,
  Menu,
  Typography,
} from 'antd';
import UserListDrawer from './UserListDrawer';
import { User } from '../../types/partialUser';

interface SideBarHeaderProps {
  submitLoading: boolean;
  openDrawe: boolean;
  isGroupChatCrate: boolean;
  onSelectUser: (r: User) => Promise<void>;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  setIsGroupChatCrate: Dispatch<SetStateAction<boolean>>;
  screen: Partial<Record<Breakpoint, boolean>>;
  isDark: boolean;
  chatForm: FormInstance;
  createGroupChat: () => Promise<void>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  searchQuery: string;
}

const SideBarHeader: FC<SideBarHeaderProps> = (props) => {
  return (
    <div className='p-2'>
      <div className='flex items-center justify-between'>
        <Typography.Title level={4}>Chats</Typography.Title>
        <div className=' flex space-x-4'>
          <Typography.Text>
            <PlusSquareOutlined
              style={{ fontSize: '18px' }}
              onClick={() => props.setOpenDrawer(true)}
            />
          </Typography.Text>
          <UserListDrawer {...props} />

          <Dropdown
            trigger={['click']}
            placement='bottomRight'
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() => {
                    props.setIsGroupChatCrate(true);
                    props.setOpenDrawer(true);
                  }}
                >
                  New group
                </Menu.Item>
              </Menu>
            }
          >
            <Typography.Text>
              <MoreOutlined style={{ fontSize: '18px' }} />
            </Typography.Text>
          </Dropdown>
        </div>
      </div>

      <div>
        <Input
          value={props.searchQuery}
          onChange={(e) => props.setSearchQuery(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
          placeholder='Search chats...'
        />
      </div>
    </div>
  );
};

export default SideBarHeader;
