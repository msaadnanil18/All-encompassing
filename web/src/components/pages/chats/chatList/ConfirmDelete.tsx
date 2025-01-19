import React, { FC, ReactNode } from 'react';
import { ChatListItem } from '../types';

const ConfirmDelete: FC<{
  children: ReactNode;
  chat: ChatListItem;
  title: string;
  content: string;
  modal: any;
}> = ({ children, title, content, chat, modal }) => {
  const showConfirm = (title: string, content: string, onOk: () => void) => {
    modal.confirm({
      title,
      content,
      okText: 'Yes',
      cancelText: 'No',
      onOk,
    });
  };

  const handelOnDeleteAndExite = (chat: ChatListItem) => {};

  return (
    <div
      onClick={() =>
        showConfirm(title, content, () => handelOnDeleteAndExite(chat))
      }
    >
      {children}
    </div>
  );
};

export default ConfirmDelete;
