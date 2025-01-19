import React, { useState, ReactNode } from 'react';
import { Button } from 'antd';
import { BaseButtonProps } from 'antd/es/button/button';
import { PlusOutlined } from '@ant-design/icons';
import { addFiles } from '../components/types/addFiles';
import UploadFiles from './UploadFiles';

const DriveFileUpload = ({
  chooseFiles,
  buttonProps,
  title,
}: {
  chooseFiles: (files: addFiles[]) => void;
  buttonProps?: BaseButtonProps;
  title?: ReactNode;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <UploadFiles {...{ chooseFiles, visible, setVisible }} />
      <Button
        id='file-upload'
        onClick={() => setVisible(true)}
        {...(buttonProps
          ? buttonProps
          : {
              type: 'text',
              shape: 'circle',
              icon: <PlusOutlined />,
            })}
      >
        {title}
      </Button>
    </div>
  );
};

export default DriveFileUpload;
