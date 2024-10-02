import { Router } from 'express';
import { driveFileUplaod } from '../controllers/fileUpload.controller';
const fileUploadRouter = Router();

fileUploadRouter.route('/generate-signed-url').post(driveFileUplaod);

export { fileUploadRouter };
