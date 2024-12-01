import React, { useState } from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { Image, Video, getFileSize, Audio } from 'react-native-compressor';
import RNFS from 'react-native-fs';
import { UploadFileTypes } from './types';

export const useFilesUpload = <T = (r: any) => void>({
  files,
}: {
  files: <T extends UploadFileTypes>(r: T) => void;
}) => {
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const compressFile = async (
    fileUri: string,
    type: string | null,
    fileName: string | null,
  ): Promise<string | null> => {
    try {
      const tempPath = RNFS.TemporaryDirectoryPath + '/' + fileName;
      await RNFS.copyFile(fileUri, tempPath);

      if (type?.startsWith('image/')) {
        return await Image?.compress(tempPath, {
          compressionMethod: 'auto',
        });
      } else if (type?.startsWith('video/')) {
        return await Video.compress(tempPath, { compressionMethod: 'auto' });
      } else {
        return fileUri;
      }
    } catch (error) {
      console.error('Compression error:', error);
      return null;
    }
  };

  const validateFileSize = async (fileUri: string): Promise<boolean> => {
    try {
      const fileSize = await getFileSize(fileUri);
      const maxFileSize = 10 * 1024 * 1024;
      return Number(fileSize) <= maxFileSize;
    } catch (error) {
      console.error('Error getting file size:', error);
      return false;
    }
  };

  const uploadFile = async (file: DocumentPickerResponse) => {
    if (!file) {
      setUploadStatus('No file selected');
      return;
    }

    try {
      const compressedUri = await compressFile(file.uri, file?.type, file.name);

      if (!compressedUri) {
        setUploadStatus('Compression failed');
        return;
      }

      const isValid = validateFileSize(compressedUri);
      if (!isValid) {
        setUploadStatus('File exceeds the 10 MB limit after compression');
        return;
      }

      setUploadStatus('Uploading...');
      files({ uri: compressedUri, fileName: file.name, fileType: file.type });

      setUploadStatus('Upload successful');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed');
    }
  };

  const pickFile = async (
    fileTypes: Array<(typeof types)[keyof typeof types]>,
  ) => {
    try {
      const res = await DocumentPicker.pick({
        type: fileTypes,
      });
      // setFile(res[0]);
      await uploadFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error picking file:', err);
      }
    }
  };

  return { pickFile, uploadStatus };
};
