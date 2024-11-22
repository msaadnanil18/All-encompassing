import { fileUplaodService } from '../components/services/fileUpload';
import React, { useState } from 'react';
import { Upload, Button, Progress, message, Typography } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import axios, { AxiosProgressEvent } from 'axios';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadFile } from 'antd/lib';
import { addFiles } from '../components/types/addFiles';

const FileUpload = ({ addFiles }: { addFiles: (file: addFiles) => void }) => {
  const [progress, setProgress] = useState<{
    [key: string]: { percentCompleted: number; file: UploadFile };
  }>({});

  const openNativeFileSelector = () => {
    document.querySelector<HTMLInputElement>('#upload-input')?.click();
  };

  const uniqueFiles = React.useRef<Set<string>>(new Set());
  const handleFileInput = async (info: UploadChangeParam<UploadFile<any>>) => {
    const fileList = info.fileList.filter(
      (file) => !uniqueFiles.current.has(file.name + file.size)
    );

    fileList.forEach((file) => {
      uniqueFiles.current.add(file.name + file.size);
    });

    if (fileList.length === 0) return;

    try {
      const newProgress: { [key: string]: number } = {};

      await Promise.all(
        fileList.map(async (file) => {
          const { uid, originFileObj } = file;
          if (!uid || !originFileObj) return;
          const { data } = await fileUplaodService();
          const formData = new FormData();
          formData.append('file', originFileObj);
          formData.append('api_key', data.api_key);
          formData.append('timestamp', data.timestamp);
          formData.append('signature', data.signature);
          formData.append('cloud_name', data.cloud_name);

          const uploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${data.cloud_name}/upload`,
            formData,
            {
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                const totalSize = progressEvent.total || file.size;
                if (!totalSize) return;
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / totalSize
                );
                setProgress((prevProgress) => ({
                  ...prevProgress,
                  [uid]: { percentCompleted, file },
                }));
              },
            }
          );
          addFiles({
            asset_id: uploadResponse.data.asset_id,
            format: uploadResponse.data.format,
            api_key: uploadResponse.data.api_key,
            url: uploadResponse.data.url,
            bytes: uploadResponse.data.bytes,
            resource_type: uploadResponse.data.resource_type,
            original_filename: uploadResponse.data.original_filename,
          });
          setProgress({});
        })
      );
    } catch (error) {
      message.error('Error uploading files');
    }
  };

  return (
    <div>
      <Upload
        className='hidden'
        id='upload-input'
        beforeUpload={() => false}
        onChange={handleFileInput}
        showUploadList={false}
        multiple
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <div
        className='rounded-md border-dashed border-2 border-gray-300 cursor-pointer p-8'
        onClick={openNativeFileSelector}
      >
        {Object.values(progress).some(
          (uploadProgress) => uploadProgress.percentCompleted > 0
        ) && (
          <div className='my-2'>
            {Object.entries(progress).map(([fileName, progress]) => (
              <div key={fileName}>
                <Typography.Text>
                  {progress.file.fileName || progress.file.name}
                </Typography.Text>
                <Progress percent={progress.percentCompleted} />
              </div>
            ))}
          </div>
        )}

        {Object.values(progress).length === 0 && (
          <div className='text-center p-8'>
            <Typography.Link>
              <InboxOutlined size={42} className='text-5xl' />
            </Typography.Link>
            <Typography.Title level={4} className='m-0 p-0 mt-4'>
              Click or drag file to this area to upload
            </Typography.Title>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
