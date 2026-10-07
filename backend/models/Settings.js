import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  businessName: String,
  legalName: String,
  tagline: String,
  phone: String,
  phoneLabel: String,
  whatsapp: String,
  whatsappLabel: String,
  email: String,
  address: String,
  website: String,
  googleMapsUrl: String,
  googleBusinessProfile: String,
  instagram: String,
  facebook: String,
  youtube: String,
  openingHours: String,
  serviceArea: String,
  logoText: String,
  logo: String,
  colors: {
    dark: String,
    green: String,
    sage: String,
    accent: String,
    background: String
  }
}, { timestamps: true });

settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne({});
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('Settings', settingsSchema);
