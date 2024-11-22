import { RequestHandler } from 'express';
import multer from 'multer';

export const uploadHelperImageKit = (
  folderName = 'files',
  fileTypes = /jpeg|jpg|png|gif|pdf|mp4|csv|xlsx|doc|docx|zip|svg/
): RequestHandler => {
  const storage = multer.memoryStorage();

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
