import { FC, ReactNode } from 'react';
import { ChatListItem } from '../types';

const ConfirmDelete: FC<{
  children: ReactNode;
  chat: ChatListItem;
  title: string;
  content: string;
  modal: any;
  onOk?: (r?: string) => Promise<void>;
}> = ({ children, title, content, chat, modal, onOk }) => {
  const showConfirm = (title: string, content: string, onOk: () => void) => {
    modal.confirm({
      title,
      content,
      okText: 'Yes',
      cancelText: 'No',
      onOk,
    });
  };

  return (
    <div onClick={() => showConfirm(title, content, () => onOk?.(chat._id))}>
      {children}
    </div>
  );
};

export default ConfirmDelete;
