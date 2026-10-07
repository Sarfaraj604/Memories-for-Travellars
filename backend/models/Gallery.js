import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  src: { type: String, required: true },
  title: String,
  category: String,
  alt: String,
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  cloudinaryPublicId: String
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
