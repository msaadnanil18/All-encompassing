import Service from '../../helpers/service';

export const fileUplaodService = Service('/api/generate-signed-url');
export const DirectFileUploadImageKitService = Service(
  '/api/directUploadImageKit'
);
export const DirectFileUploadService = Service('/api/direct-file-upload');
export const ImageKitAuthToken = Service('/api/imagekit_auth');
