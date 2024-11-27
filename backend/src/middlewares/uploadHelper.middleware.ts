import { RequestHandler } from 'express';
import multer from 'multer';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dayjs from 'dayjs';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadHelper = (
  folderName = 'files',
  fileTypes = /jpeg|jpg|png|gif|pdf|mp4|csv|xlsx|doc|docx|zip|svg/
): RequestHandler => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file): Promise<UploadApiOptions> => {
      const ext = file.mimetype.split('/')[1];

      return {
        folder: folderName,
        format: ext,
        resource_type: file.mimetype.startsWith('image') ? 'image' : 'raw',
        public_id: file.originalname.replace(/\.[^/.]+$/, '') + '-' + dayjs(),
      };
    },
  });
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb, fileTypes);
    },
    limits: {
      fieldSize: 50 * 1024 * 1024,
      fileSize: 50 * 1024 * 1024,
    },
  }).array(folderName, 10);
};

const checkFileType = (
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
  filetypes: RegExp
) => {
  const extname = filetypes.test(
    file.originalname.split('.').pop()?.toLowerCase() || ''
  );
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Error: Invalid file type! Only images, videos, PDFs, and documents are allowed.'
      )
    );
  }
};
