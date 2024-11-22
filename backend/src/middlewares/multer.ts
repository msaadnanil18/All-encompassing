import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directory where files will be stored
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure the directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true }); // Create directory and subdirectories if they don't exist
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); // Save files in the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

export const upload = multer({ storage });
