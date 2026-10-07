import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, required: true, lowercase: true, trim: true },
  description: String,
  price: String,
  priceValue: Number,
  maxGuests: String,
  bedType: String,
  amenities: [{ type: String }],
  image: String,
  gallery: [{ type: String }],
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  seoTitle: String,
  metaDescription: String
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
