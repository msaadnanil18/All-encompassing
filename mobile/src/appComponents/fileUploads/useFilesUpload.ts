import React, { useState } from 'react';
import DocumentPicker, { types } from 'react-native-document-picker';
import { Image, Video, getFileSize } from 'react-native-compressor';
import RNFS from 'react-native-fs';
import * as ImagePicker from 'react-native-image-picker';
import { Platform } from 'react-native';
export const useFilesUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // const compressFile = async (
  //   fileUri: string,
  //   type: string | null,
  //   fileName: string | null,
  // ): Promise<string | null> => {
  //   try {
  //     const tempPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
  //     await RNFS.copyFile(fileUri, tempPath);

  //     if (type?.startsWith('image/')) {
  //       return await Image.compress(tempPath, {
  //         compressionMethod: 'auto',
  //       });
  //     } else if (type?.startsWith('video/')) {
  //       return await Video.compress(tempPath);
  //     } else {
  //       return fileUri;
  //     }
  //   } catch (error) {
  //     console.error('Compression error:', error);
  //     return null;
  //   }
  // };

  const compressFile = async (
    fileUri: string,
    type: string | null,
    fileName: string | null,
  ): Promise<string | null> => {
    const tempPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;

    try {
      // Copy the file to a temporary location
      await RNFS.copyFile(fileUri, tempPath);

      let compressedFilePath: string | null = null;

      // Compress based on the file type
      if (type?.startsWith('image/')) {
        compressedFilePath = await Image.compress(tempPath, {
          compressionMethod: 'auto',
        });
      } else if (type?.startsWith('video/')) {
        compressedFilePath = await Video.compress(tempPath);
      } else {
        compressedFilePath = fileUri;
      }

      await RNFS.unlink(tempPath);
      console.log('Temporary file removed successfully!');

      return compressedFilePath;
    } catch (error) {
      console.error('Compression error:', error);

      try {
        if (await RNFS.exists(tempPath)) {
          await RNFS.unlink(tempPath);
          console.log('Temporary file removed after error!');
        }
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }

      return null;
    }
  };

  const validateFileSize = async (fileUri: string): Promise<boolean> => {
    try {
      const fileSize = await getFileSize(fileUri);
      const maxFileSize = 10 * 1024 * 1024; // 10 MB
      return Number(fileSize) <= maxFileSize;
    } catch (error) {
      console.error('Error getting file size:', error);
      return false;
    }
  };

  const processFile = async (file: any) => {
    if (!file) {
      setUploadStatus('No file selected');
      return null;
    }

    try {
      const isValidSize = await validateFileSize(file.uri);
      const compressedUri = isValidSize
        ? file.uri
        : await compressFile(file.uri, file.type, file.name);

      return {
        uri: compressedUri,
        fileName: file.name,
        fileType: file.type,
      };
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('Processing failed');
      return null;
    }
  };

  const processMultipleFiles = async (files: any[]) => {
    return Promise.all(files.map(processFile));
  };

  const openGallery = async (): Promise<any[]> => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 0,
        ...(Platform.OS === 'ios' && { presentationStyle: 'overFullScreen' }),
        assetRepresentationMode: 'auto',
      });
      if (result.assets && result.assets.length > 0) {
        return await processMultipleFiles(
          result.assets.map((file) => ({
            uri: file.uri!,
            type: file.type || 'image/*',
            name: file.fileName || 'unknown',
          })),
        );
      }
    } catch (error) {
      console.error('Failed to open gallery:', error);
    }
    return [];
  };

  const pickFile = async (
    fileTypes?: Array<(typeof types)[keyof typeof types]>,
  ): Promise<any[]> => {
    try {
      const res = await DocumentPicker.pick({
        type: fileTypes,
        allowMultiSelection: true,
      });
      return await processMultipleFiles(
        res.map((file) => ({
          uri: file.uri,
          type: file.type,
          name: file.name,
        })),
      );
    } catch (error) {
      console.error('File selection failed:', error);
    }
    return [];
  };

  const openCameraImage = async () => {
    try {
      const result = await ImagePicker.launchCamera({ mediaType: 'photo' });
      if (result.assets && result.assets.length > 0) {
        return await processFile({
          uri: result.assets[0].uri!,
          type: result.assets[0].type || 'image/*',
          name: result.assets[0].fileName || 'unknown',
        });
      }
    } catch (error) {
      console.error('Failed to open camera for image:', error);
    }
    return null;
  };

  const openCameraVideo = async () => {
    try {
      const result = await ImagePicker.launchCamera({ mediaType: 'video' });
      if (result.assets && result.assets.length > 0) {
        return await processFile({
          uri: result.assets[0].uri!,
          type: result.assets[0].type || 'video/*',
          name: result.assets[0].fileName || 'unknown',
        });
      }
    } catch (error) {
      console.error('Failed to open camera for video:', error);
    }
    return null;
  };

  const triggeredPickFiles = async ({
    fileType,
    triggeredUp,
  }: {
    fileType?: Array<(typeof types)[keyof typeof types]>;
    triggeredUp: 'cameraImage' | 'cameraVideo' | 'audio' | 'file' | 'gallery';
  }): Promise<any | any[]> => {
    switch (triggeredUp) {
      case 'cameraImage':
        return await openCameraImage();
      case 'cameraVideo':
        return await openCameraVideo();
      case 'gallery':
        return await openGallery();
      case 'file':
        return await pickFile(fileType);
      default:
        return null;
    }
  };

  return { uploadStatus, triggeredPickFiles };
};
