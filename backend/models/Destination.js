import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true, required: true, lowercase: true, trim: true },
  description: String,
  image: String,
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  seoTitle: String,
  metaDescription: String
}, { timestamps: true });

export default mongoose.model('Destination', destinationSchema);
