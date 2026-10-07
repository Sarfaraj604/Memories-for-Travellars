import Gallery from '../models/Gallery.js';
import { deleteImage } from '../utils/cloudinary.js';

const normalizeGalleryPayload = (body) => {
  const data = { ...body };
  if (data.url && !data.src) data.src = data.url;
  if (data.altText && !data.alt) data.alt = data.altText;
  if (data.publicId && !data.cloudinaryPublicId) data.cloudinaryPublicId = data.publicId;
  delete data.url;
  delete data.altText;
  delete data.publicId;
  return data;
};

export const listGallery = async (req, res, next) => {
  try {
    const items = await Gallery.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const data = normalizeGalleryPayload(req.body);
    
    if (typeof data.order === 'undefined') {
      const lastItem = await Gallery.findOne().sort({ order: -1 });
      data.order = lastItem && typeof lastItem.order === 'number' ? lastItem.order + 1 : 1;
    }

    const item = await Gallery.create(data);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, normalizeGalleryPayload(req.body), { returnDocument: 'after', runValidators: true });
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    
    if (item.cloudinaryPublicId) {
      await deleteImage(item.cloudinaryPublicId).catch(err => console.error('Cloudinary delete failed:', err));
    }
    
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  listGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
