import { log } from 'console';
import { asyncHandler } from '../utils/asyncHandler';
import cloudinary from 'cloudinary';
import { ApiError } from '../utils/ApiError';
import dotenv from 'dotenv';
dotenv.config();
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

export { driveFileUplaod };
