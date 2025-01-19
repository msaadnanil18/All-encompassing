import { UploadChangeParam } from 'antd/es/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { fileUplaodService } from '../components/services/fileUpload';
import axios from 'axios';
import ImageKit from 'imagekit';
import { notification } from 'antd';
import dayjs from 'dayjs';

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
});

export const getUploadFile = async <
  T extends {
    file: UploadChangeParam<UploadFile<any>>;
    uploadType: 'cloud1' | 'cloud2' | 'cloud3';
  },
>({
  file,
  uploadType,
}: T) => {
  const uniqueFiles = new Set();
  const fileList = file.fileList.filter(
    (file) => !uniqueFiles.has(file.name + file.size)
  );
  fileList.forEach((file) => {
    uniqueFiles.add(file.name + file.size);
  });
  if (fileList.length === 0) return;

  try {
    if (uploadType === 'cloud1') {
      const data = await Promise.all(
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
            formData
          );

          return uploadResponse.data;
        })
      );

      return data;
    } else if (uploadType === 'cloud2') {
      const _result = [];
      for (const file of fileList) {
        const result = await imagekit.upload({
          file: file.originFileObj as any,
          fileName: file.name.replace(/\.[^/.]+$/, '') + '-' + dayjs(),
          tags: ['react', 'typescript', 'upload'],
          folder: 'uploads',
        });

        _result.push(result);
      }

      return _result;
    }
  } catch (error) {
    notification.error({
      message: 'Error uploading files',
    });
  }
};
