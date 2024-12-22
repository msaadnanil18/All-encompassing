import React, { FC, useState, Dispatch, SetStateAction, Fragment } from 'react';
import {
  Avatar,
  Breakpoint,
  Button,
  Checkbox,
  Drawer,
  FormInstance,
  Input,
  List,
  Spin,
} from 'antd';
import useUserList from '../../hooks/useUserList';
import { head, startCase } from 'lodash-es';
import { User } from '../../types/partialUser';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import GroupCreateForm from './GroupCreateForm';
import { darkModeColors, lightModeColors } from '../../utills';

const UserListDrawer: FC<{
  isGroupChatCrate: boolean;
  openDrawe: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  onSelectUser: (r: User) => Promise<void>;
  setIsGroupChatCrate: Dispatch<SetStateAction<boolean>>;
  screen: Partial<Record<Breakpoint, boolean>>;
  isDark: boolean;
  chatForm: FormInstance;
  submitLoading: boolean;
  createGroupChat: () => Promise<void>;
}> = (props) => {
  const {
    isGroupChatCrate,
    openDrawe,
    setOpenDrawer,
    setIsGroupChatCrate,
    screen,
    isDark,
  } = props;
  const { userList, searchUser, loading, loadMore, hasMore } = useUserList({
    limit: 10,
  });
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isGroupFormVisible, setIsGroupFormVisible] = useState(false);
  const handleSelect = (selected: User[]) => {
    setSelectedUsers(selected);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading) {
      loadMore();
    }
  };

  const handelOnCancel = () => {
    setOpenDrawer(false);
    setIsGroupChatCrate(false);
    setIsGroupFormVisible(false);
    setSelectedUsers([]);
  };

  return (
    <Drawer
      mask={false}
      width={
        screen.xs
          ? 400
          : screen.sm
            ? 340
            : screen.md
              ? 400
              : screen.lg
                ? 550
                : screen.xl
                  ? 500
                  : screen.xxl
                    ? 600
                    : 700
      }
      className='md:w-1/4 lg:w-1/4 w-full'
      destroyOnClose
      open={openDrawe}
      placement='left'
      closeIcon={<ArrowLeftOutlined />}
      title={isGroupChatCrate ? 'Add group members' : 'New chat'}
      onClose={handelOnCancel}
    >
      <Spin spinning={props.submitLoading}>
        {isGroupFormVisible ? (
          <GroupCreateForm {...props} handelOnCancel={handelOnCancel} />
        ) : (
          <Fragment>
            <Input
              placeholder='Search users'
              onChange={async (e) => {
                await searchUser(e.target.value);
              }}
            />
            <div
              style={{
                height: '400px',
                overflow: 'auto',
                padding: '8px',
                scrollbarWidth: 'none',
                scrollbarColor: '#ddd',
              }}
              onScroll={handleScroll}
            >
              <List
                dataSource={userList}
                renderItem={(user) => (
                  <List.Item
                    onClick={async () => {
                      if (!isGroupChatCrate) {
                        await props.onSelectUser(user);
                      }
                    }}
                    style={!isGroupChatCrate ? { padding: '10px 30px' } : {}}
                    className={` ${!isGroupChatCrate ? `${isDark ? `hover:bg-[${darkModeColors.hoverBackground}]` : `hover:bg-[${lightModeColors.hoverBackground}]`} cursor-pointer` : ''} `}
                  >
                    {isGroupChatCrate ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <Checkbox
                          value={user._id}
                          checked={selectedUsers
                            .map((user) => user._id)
                            .includes(user._id)}
                          onChange={(e) =>
                            handleSelect(
                              e.target.checked
                                ? [...selectedUsers, user]
                                : selectedUsers.filter(
                                    (_user) => _user._id !== user._id
                                  )
                            )
                          }
                          style={{ marginRight: 8, marginBottom: 6 }}
                        />
                        <List.Item.Meta
                          avatar={
                            user.avatar ? (
                              <Avatar size={40} src={user.avatar} />
                            ) : (
                              <Avatar
                                size={40}
                                style={{
                                  backgroundColor: '#fde3cf',
                                  color: '#f56a00',
                                }}
                              >
                                {head(startCase(user?.name))}
                              </Avatar>
                            )
                          }
                          title={user.name}
                          description={user.email}
                        />
                      </div>
                    ) : (
                      <List.Item.Meta
                        avatar={
                          user.avatar ? (
                            <Avatar size={40} src={user.avatar} />
                          ) : (
                            <Avatar
                              size={40}
                              style={{
                                backgroundColor: '#fde3cf',
                                color: '#f56a00',
                              }}
                            >
                              {head(startCase(user?.name))}
                            </Avatar>
                          )
                        }
                        title={user.name}
                        description={user.email}
                      />
                    )}
                  </List.Item>
                )}
              />
              {loading && (
                <Spin style={{ display: 'block', margin: '16px auto' }} />
              )}
            </div>
            {selectedUsers.length > 1 && isGroupChatCrate ? (
              <div className=' flex items-center justify-items-center justify-center mt-2'>
                <Button
                  icon={<ArrowRightOutlined />}
                  type='primary'
                  shape='circle'
                  size='large'
                  onClick={() => {
                    setIsGroupFormVisible(true);
                    props.chatForm.setFieldValue('members', selectedUsers);
                  }}
                />
              </div>
            ) : null}
          </Fragment>
        )}
      </Spin>
    </Drawer>
  );
};

export default UserListDrawer;
