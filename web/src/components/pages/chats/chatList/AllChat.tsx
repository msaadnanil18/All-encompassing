import { Breakpoint, Dropdown, Menu, Modal } from 'antd';
import { FC, Fragment } from 'react';
import { ChatListItem } from '../types';
import { User } from '../../../types/partialUser';
import ConfirmDelete from './ConfirmDelete';
import ChatList from '../ChatList';

const AllChat: FC<{
  sortedChats: Array<ChatListItem>;
  me: User | null;
  hendelOnArchive: (r?: string) => void;
}> = (props) => {
  const { sortedChats, me, hendelOnArchive } = props;
  const [modal, contextHolder] = Modal.useModal();
  return (
    <Fragment>
      {contextHolder}
      {sortedChats
        .filter((chat) =>
          chat.archivedBy.length > 0
            ? !chat.archivedBy.some((arch) => arch.user?._id === me?._id)
            : true
        )
        .map((chat) => {
          return (
            <Dropdown
              key={chat._id}
              overlayStyle={{ margin: 0, padding: 0 }}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => hendelOnArchive(chat._id)}>
                    Archive chat
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
                <ChatList {...{ chat, ...props }} />
              </div>
            </Dropdown>
          );
        })}
    </Fragment>
  );
};

export default AllChat;
