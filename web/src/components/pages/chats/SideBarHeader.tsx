import React, { FC, Dispatch, SetStateAction } from 'react';
import {
  MoreOutlined,
  PlusOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Breakpoint,
  Button,
  Dropdown,
  FormInstance,
  Input,
  Menu,
  Typography,
} from 'antd';
import UserListDrawer from './UserListDrawer';
import { User } from '../../types/partialUser';
import { DisplayView } from './types';
import { startCase } from 'lodash-es';

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
  setDisplayView: Dispatch<SetStateAction<DisplayView>>;
  displayView: DisplayView;
}

const SideBarHeader: FC<SideBarHeaderProps> = (props) => {
  return (
    <div className='p-2'>
      <div className='flex items-center justify-between'>
        <Typography.Title level={4}>Chats</Typography.Title>
        <div className=' flex space-x-4'>
          <Button
            type='text'
            size='small'
            icon={<PlusOutlined style={{ fontSize: '15px' }} />}
            onClick={() => props.setOpenDrawer(true)}
          />
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
            <Button
              size='small'
              type='text'
              icon={<MoreOutlined style={{ fontSize: '15px' }} />}
            />
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
      <div className='pt-3 p-0 space-x-3'>
        {(['all', 'unread', 'archived', 'groups'] as DisplayView[]).map(
          (id) => (
            <Button
              key={id}
              id={id}
              size='small'
              type={props.displayView === id ? 'primary' : 'default'}
              onClick={() => props.setDisplayView(id)}
            >
              {startCase(id)}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default SideBarHeader;
