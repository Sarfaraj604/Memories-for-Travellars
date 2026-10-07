import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, required: true, lowercase: true, trim: true },
  destination: { type: String, required: true, trim: true },
  shortDescription: String,
  description: String,
  price: String,
  priceValue: Number,
  priceLabel: String,
  durationDays: Number,
  nights: Number,
  guests: String,
  tripType: [{ type: String }],
  tags: [{ type: String }],
  highlights: [{ type: String }],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    places: [{ type: String }],
    meals: String,
    accommodation: String
  }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  accommodation: String,
  transportation: String,
  importantInfo: [{ type: String }],
  faqs: [{
    question: String,
    answer: String
  }],
  image: String,
  gallery: [{ type: String }],
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  seoTitle: String,
  metaDescription: String,
  ogImage: String
}, { timestamps: true });

packageSchema.index({ active: 1, order: 1 });
packageSchema.index({ featured: 1, active: 1 });

export default mongoose.model('Package', packageSchema);
