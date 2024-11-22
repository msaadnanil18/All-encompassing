import { Modal, Tabs } from 'antd';
import React, { useState, FC, Dispatch, SetStateAction } from 'react';
import { addFiles, DriveModes } from '../components/types/addFiles';
import FileUpload from './FileUpload';
import DirectFileUploadImageKit from './DirectFileUplaodImageKit';
import { CameraOutlined } from '@ant-design/icons';
import WebCamUpload from './WebCamUpload';
import SelectedFiles from './SelectedFile';

const UploadFiles: FC<{
  chooseFiles: (files: addFiles[]) => void;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  uploadType?: DriveModes[];
}> = ({ chooseFiles, visible, setVisible, uploadType }) => {
  const [activeTab, setActiveTab] = useState<string>(
    uploadType?.[0] || 'images'
  );
  const [uploadFile, setUploadFile] = useState<addFiles[]>([]);

  const successFiles = uploadFile.filter((file) => !file.error);
  const removeFile = (file: addFiles) => {
    const id = file.asset_id;
    setUploadFile((files) => uploadFile.filter((file) => file.asset_id !== id));
  };

  const onCloseHandler = () => {
    setVisible(false);
    setUploadFile([]);
  };
  const modes = uploadType || [
    'images',
    'documents',
    'drive',
    'upload',
    'camera',

    'video',
  ];

  const tabItems: Record<string, any> = {
    images: {
      key: 'images',
      label: 'Images',
      children: (
        <FileUpload
          addFiles={(file) => setUploadFile((prev) => [...prev, file])}
        />
      ),
    },
    documents: {
      key: 'documents',
      label: 'Documents',
      children:
        activeTab === 'documents' ? (
          <DirectFileUploadImageKit
            addFiles={(file) => setUploadFile((prev) => [...prev, file])}
          />
        ) : null,
    },
    camera: {
      key: 'camera',
      label: '',
      icon: <CameraOutlined style={{ fontSize: '18px' }} />,
      children:
        visible && activeTab === 'camera' ? (
          <WebCamUpload
            addFiles={(file) => setUploadFile((prev) => [...prev, file])}
          />
        ) : null,
    },
  };

  const tabs = modes
    .map((mode) => tabItems[mode])
    .filter((tab) => tab !== undefined);

  return (
    <Modal
      open={visible}
      onCancel={onCloseHandler}
      centered
      maskClosable={false}
      title='Send Files'
      onOk={() => {
        chooseFiles(uploadFile);
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
        className='h-96'
        items={tabs}
      />
      <div className='mt-4'></div>
      <SelectedFiles files={uploadFile} removeFile={removeFile} />
    </Modal>
  );
};

export default UploadFiles;
