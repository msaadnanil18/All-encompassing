import React, { useState } from 'react';
import SelectedFiles from './SelectedFile';
import FileUpload from './FileUpload';
import { Button, Modal, Tabs } from 'antd';
import { BaseButtonProps } from 'antd/es/button/button';
import dayjs from 'dayjs';
import { CameraOutlined, PlusOutlined } from '@ant-design/icons';
import { addFiles } from '../components/types/addFiles';
import WebCamUpload from './WebCamUpload';

const DriveFileUpload = ({
  chooseFiles,
  buttonProps,
}: {
  chooseFiles: (files: addFiles[]) => void;
  buttonProps?: BaseButtonProps;
}) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [uploadFile, setUploadFile] = useState<addFiles[]>([]);

  const successFiles = uploadFile.filter((file) => !file.error);
  const removeFile = (file: addFiles) => {
    const id = file.asset_id;
    setUploadFile((files) => uploadFile.filter((file) => file.asset_id !== id));
  };

  const onCloseHandler = () => {
    setActiveTab('upload');
    setVisible(false);
    setUploadFile([]);
  };

  return (
    <div>
      <Modal
        open={visible}
        onCancel={onCloseHandler}
        centered
        maskClosable={false}
        title="Send Files"
        onOk={() => {
          chooseFiles(activeTab === 'upload' ? uploadFile : successFiles);
          onCloseHandler();
        }}
        okButtonProps={{
          disabled: uploadFile.length == 0 && successFiles.length === 0,
        }}
        okText={`Use ${successFiles.length || uploadFile.length} Files`}
      >
        <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          onTabClick={setActiveTab}
          className="h-96"
          items={[
            {
              key: 'upload',
              label: `Send small files`,
              children: (
                <FileUpload
                  addFiles={(file) => setUploadFile((prev) => [...prev, file])}
                />
              ),
            },
            {
              key: 'camera',
              label: '',
              icon: <CameraOutlined style={{ fontSize: '18px' }} />,
              children:
                visible && activeTab === 'camera' ? (
                  <WebCamUpload
                    addFiles={(file) =>
                      setUploadFile((prev) => [...prev, file])
                    }
                  />
                ) : null,
            },
          ]}
        />
        <div className="mt-4"></div>
        <SelectedFiles files={uploadFile} removeFile={removeFile} />
      </Modal>

      <Button
        id="file-upload"
        onClick={() => setVisible(true)}
        {...(buttonProps
          ? buttonProps
          : {
              type: 'text',
              shape: 'circle',
              icon: <PlusOutlined />,
            })}
      />
    </div>
  );
};

export default DriveFileUpload;
