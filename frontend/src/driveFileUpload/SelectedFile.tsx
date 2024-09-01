import {
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FileZipOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Alert, Button, Tooltip } from 'antd';
import React, { FC } from 'react';
import { addFiles } from '../components/types/addFiles';

export interface SelectedFilesProps {
  files: addFiles[];
  removeFile: (file: addFiles) => void;
}

export const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <FileImageOutlined />;
  if (mimeType.startsWith('video/')) return <FileImageOutlined />;
  if (mimeType === 'application/pdf') return <FilePdfOutlined />;

  if (
    mimeType === 'application/zip' ||
    mimeType === 'application/x-rar-compressed'
  )
    return <FileZipOutlined />;
  if (
    mimeType === 'application/vnd.ms-powerpoint' ||
    mimeType === 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  )
    return <FilePptOutlined />;

  if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/officedocument.wordprocessingml.document'
  )
    return <FileWordOutlined />;
  return <FileOutlined />;
};

const SelectedFiles: FC<SelectedFilesProps> = ({ files, removeFile }) => {
  return (
    <>
      {(files || []).map((selectedFile) => (
        <Alert
          key={selectedFile.asset_id}
          banner
          closable
          showIcon
          onClose={() => removeFile(selectedFile)}
          action={
            selectedFile?.error ? (
              <Tooltip title={selectedFile.error}>
                <Button
                  size="small"
                  type="dashed"
                  color="ghost"
                  icon={<InfoCircleOutlined />}
                />
              </Tooltip>
            ) : null
          }
          message={
            <>
              <div>
                {decodeURIComponent(selectedFile.original_filename || '')}
              </div>
            </>
          }
          icon={getFileIcon(selectedFile.resource_type || '')}
          type={selectedFile.error ? 'error' : 'success'}
        />
      ))}
    </>
  );
};

export default SelectedFiles;
