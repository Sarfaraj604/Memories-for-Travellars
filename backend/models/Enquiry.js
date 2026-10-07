import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  destination: String,
  date: String,
  guests: String,
  nights: String,
  tripType: String,
  budget: String,
  message: String,
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new'
  },
  notes: String,
  tourPackage: String,
  archived: { type: Boolean, default: false }
}, { timestamps: true });

enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 });

export default mongoose.model('Enquiry', enquirySchema);
