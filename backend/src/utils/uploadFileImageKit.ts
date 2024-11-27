import { imagekit } from '../controllers/fileUpload.controller';
import fs from 'fs/promises';

export const uploadFileImageKit = async (
  filePath: string,
  fileName: string
) => {
  try {
    const fileContent = await fs.readFile(filePath, { encoding: 'base64' });

    const response = await imagekit.upload({
      file: fileContent, // Base64 string
      fileName,
      folder: 'uploads',
    });

    return response;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('File upload to ImageKit failed');
  }
};
