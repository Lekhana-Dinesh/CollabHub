import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Make sure env vars are loaded
dotenv.config();

// Log to verify credentials are loaded
console.log(' Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? ' Set' : 'x Missing',
  api_key: process.env.CLOUDINARY_API_KEY ? ' Set' : 'x Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? ' Set' : 'x Missing',
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the connection
cloudinary.api.ping()
  .then(() => console.log(' Cloudinary connection successful'))
  .catch((err) => console.error(' Cloudinary connection failed:', err.message));

// Storage for project covers
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'collabhub/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 630, crop: 'limit' }],
  },
});

// Storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'collabhub/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
  },
});

export const uploadProjectCover = multer({ storage: projectStorage });
export const uploadAvatar = multer({ storage: avatarStorage });

export default cloudinary;