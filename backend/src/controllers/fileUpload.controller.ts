import { asyncHandler } from '../utils/asyncHandler';
import cloudinary from 'cloudinary';
import { ApiError } from '../utils/ApiError';
import dotenv from 'dotenv';
import { uploadHelper } from '../middlewares/uploadHelper.middleware';
import ImageKit from 'imagekit';
import { uploadHelperImageKit } from '../middlewares/uploadHelperForImageKit';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import { uploadFileImageKit } from '../utils/uploadFileImageKit';

dotenv.config();
export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const driveFileUplaod = asyncHandler(async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET as string
    );

    res.json({
      signature: signature,
      timestamp: timestamp,
      api_key: process.env.CLOUDINARY_CLOUD_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    throw new ApiError(500, 'Failed to generate signed URL');
  }
});

const directFileUpload = asyncHandler(async (req, res) => {
  uploadHelper()(req, res, (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ err: 'Cloud internal server error' });
    } else {
      console.log('test', req.files, Array.isArray(req.files));
      const fileArray: string[] = [];
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          fileArray.push(file.path);
        }
      }
      console.log('fileArray', fileArray);
      return res.status(200).json({ files: fileArray });
    }
  });
});

const uploadFileImggeKit = asyncHandler(async (req, res, next) => {
  uploadHelperImageKit()(req, res, async (error) => {
    if (error) {
      console.log(error);
      res.status(500).json({ err: 'Cloud internal server error' });
    } else {
      const files = req.files as Express.Multer.File[];
      const uploadResults = await Promise.all(
        files.map((file) =>
          imagekit.upload({
            file: file.buffer,
            fileName:
              file.originalname.replace(/\.[^/.]+$/, '') + '-' + dayjs(),
            folder: `uploads`,
          })
        )
      );
      return res.status(200).json({ files: uploadResults });
    }
  });
});

const magekit_auth = asyncHandler(async (req, res) => {
  const token = imagekit.getAuthenticationParameters();
  res.json(token);
});

export { driveFileUplaod, directFileUpload, uploadFileImggeKit, magekit_auth };
