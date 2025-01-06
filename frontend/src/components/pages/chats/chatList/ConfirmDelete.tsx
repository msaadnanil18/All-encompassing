import React, { FC, ReactNode } from 'react';
import { Popconfirm } from 'antd';
import { useTogglers } from '../../../hooks/togglers';

const ConfirmDelete: FC<{
  title: string;
  children: ReactNode;
}> = ({ children, title }) => {
  const confirmLoading = false;
  return (
    <Popconfirm
      title={title}
      okText='Yes'
      cancelText='No'
      //onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={close}
    >
      {children}
    </Popconfirm>
  );
};

export default ConfirmDelete;
