import { Router } from 'express';
import {
  driveFileUplaod,
  directFileUpload,
  uploadFileImggeKit,
  magekit_auth,
} from '../controllers/fileUpload.controller';
const fileUploadRouter = Router();
import { upload } from '../middlewares/multer';
import { uploadHelperImageKit } from '../middlewares/uploadHelperForImageKit';

fileUploadRouter.route('/generate-signed-url').post(driveFileUplaod);
fileUploadRouter.route('/direct-file-upload').post(directFileUpload);
fileUploadRouter.route('/directUploadImageKit').post(uploadFileImggeKit);
fileUploadRouter.route('/imagekit_auth').post(magekit_auth);

export { fileUploadRouter };
