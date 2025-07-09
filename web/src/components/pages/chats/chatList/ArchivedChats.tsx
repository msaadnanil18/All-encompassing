import { Breakpoint, Dropdown, Menu, Modal } from 'antd';
import { FC, Fragment } from 'react';
import { ChatListItem } from '../types';
import { User } from '../../../types/partialUser';
import ConfirmDelete from './ConfirmDelete';
import ChatList from '../ChatList';

const ArchivedChats: FC<{
  sortedChats: Array<ChatListItem>;
  me: User | null;
  handelOnUnArchive: (r?: string) => void;
  isDark?: boolean;
  sereen?: Partial<Record<Breakpoint, boolean>>;
}> = (props) => {
  const { sortedChats, handelOnUnArchive } = props;
  const [modal, contextHolder] = Modal.useModal();
  return (
    <Fragment>
      {contextHolder}
      {sortedChats
        .filter((chat) =>
          (chat?.archivedBy || []).some(
            (archive) => archive.user?._id === props.me?._id
          )
        )
        .map((chat) => {
          return (
            <Dropdown
              key={chat._id}
              overlayStyle={{ margin: 0, padding: 0 }}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => handelOnUnArchive(chat._id)}>
                    Unchive chat
                  </Menu.Item>
                  <Menu.Item>
                    <ConfirmDelete
                      modal={modal}
                      title='Are you sure you want to delete this chat?'
                      content='Delete Chat'
                      chat={chat}
                    >
                      Delete chat
                    </ConfirmDelete>
                  </Menu.Item>
                  {chat.groupChat && (
                    <Menu.Item>
                      <ConfirmDelete
                        modal={modal}
                        title='Are you sure you want to exit this group?'
                        content=' Exit group'
                        chat={chat}
                      >
                        Exit group
                      </ConfirmDelete>
                    </Menu.Item>
                  )}
                </Menu>
              }
              trigger={['contextMenu']}
              placement='bottomLeft'
            >
              <div>
                <ChatList {...{ ...props, chat }} />
              </div>
            </Dropdown>
          );
        })}
    </Fragment>
  );
};

export default ArchivedChats;
