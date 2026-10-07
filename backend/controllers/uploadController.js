import path from 'path';
import { uploadImage as uploadToCloudinary, deleteImage } from '../utils/cloudinary.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // File validation
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(req.file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ message: 'Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF are allowed.' });
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ message: 'File size exceeds 5MB limit.' });
    }

    if (!req.file.buffer) {
      return res.status(400).json({ message: 'File data is missing' });
    }

    const requestedFolder = req.body.folder || 'memories';
    const folder = /^[a-zA-Z0-9_-]{1,50}$/.test(requestedFolder) ? requestedFolder : 'memories';
    const result = await uploadToCloudinary(req.file.buffer, folder);
    
    res.status(200).json({
      url: result.url,
      publicId: result.publicId
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImageCtrl = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ message: 'publicId is required' });
    }
    
    await deleteImage(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  uploadImage,
  deleteImageCtrl
};
