import React, { useState, FC, useRef } from 'react';
import { Upload, Button, message, Typography, Spin } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import ImageKit from 'imagekit';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadChangeParam } from 'antd/es/upload';
import { addFiles } from '../components/types/addFiles';
import dayjs from 'dayjs';

const { Title, Link } = Typography;

type FileType = 'image' | 'video' | 'document' | 'all';
const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
});

const DirectFileUploadImageKit: FC<{
  addFiles?: (r: addFiles) => void;
  fileTypes?: FileType;
}> = ({ addFiles, fileTypes = 'video' }) => {
  const uniqueFiles = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const openNativeFileSelector = () => {
    document.querySelector<HTMLInputElement>('#upload-input-imageKit')?.click();
  };

  const handleFileInput = async (info: UploadChangeParam<UploadFile<any>>) => {
    setLoading(true);
    const fileList = info.fileList.filter(
      (file) => !uniqueFiles.current.has(file.name + file.size)
    );

    fileList.forEach((file) => {
      uniqueFiles.current.add(file.name + file.size);
    });

    if (fileList.length === 0) return;

    try {
      for (const file of fileList) {
        const result = await imagekit.upload({
          file: file.originFileObj as any,
          fileName: file.name.replace(/\.[^/.]+$/, '') + '-' + dayjs(),
          tags: ['react', 'typescript', 'upload'],
          folder: 'uploads',
        });

        console.log(result, 'result');
        if (result.url) {
          message.success(`${file.name} uploaded successfully!`);
          if (addFiles) {
            addFiles({
              url: result.url,
              bytes: result.size,
              format: result.fileType,
              original_filename: result.name,
            });
          }
        }
      }
      setLoading(false);
    } catch (error) {
      message.error('Error uploading files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fileTypeMapping: Record<FileType, string> = {
    image: 'image/*',
    video: 'video/*',
    document: '.pdf,.doc,.docx,.xls,.xlsx',
    all: '*/*',
  };

  return (
    <Spin spinning={loading}>
      <Upload
        id='upload-input-imageKit'
        className='hidden'
        beforeUpload={() => false}
        onChange={handleFileInput}
        showUploadList={false}
        multiple
        accept={fileTypeMapping[fileTypes]}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <div
        className='rounded-md border-dashed border-2 border-gray-300 cursor-pointer p-8'
        onClick={openNativeFileSelector}
      >
        <div className='text-center p-8'>
          <Link>
            <InboxOutlined size={42} className='text-5xl' />
          </Link>
          <Title level={4} className='m-0 p-0 mt-4'>
            Click or drag file to this area to upload
          </Title>
        </div>
      </div>
    </Spin>
  );
};

export default DirectFileUploadImageKit;
