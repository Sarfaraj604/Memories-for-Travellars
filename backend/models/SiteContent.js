import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  homestay: {
    intro: String,
    location: String,
    roomInfo: String,
    checkIn: String,
    checkOut: String,
    guestCapacity: String,
    amenities: [{ type: String }],
    image: String
  },
  heroImage: String,
  experiences: [{ type: String }],
  whyChoose: [{ type: String }],
  faqs: [{
    question: String,
    answer: String
  }],
  offers: [{ type: String }]
}, { timestamps: true });

siteContentSchema.statics.getInstance = async function() {
  let content = await this.findOne({});
  if (!content) {
    content = await this.create({});
  }
  return content;
};

export default mongoose.model('SiteContent', siteContentSchema);
