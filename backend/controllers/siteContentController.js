import SiteContent from '../models/SiteContent.js';
import { z } from 'zod';

const siteContentSchema = z.object({
  homestay: z.object({ intro: z.string().max(5000).optional(), location: z.string().max(300).optional(), roomInfo: z.string().max(300).optional(), checkIn: z.string().max(100).optional(), checkOut: z.string().max(100).optional(), guestCapacity: z.string().max(200).optional(), amenities: z.array(z.string().max(100)).max(40).optional(), image: z.union([z.string().url(), z.literal('')]).optional() }).optional(),
  heroImage: z.union([z.string().url(), z.literal('')]).optional(),
  experiences: z.array(z.string().max(200)).max(50).optional(),
  whyChoose: z.array(z.string().max(200)).max(50).optional(),
  faqs: z.array(z.object({ question: z.string().max(500), answer: z.string().max(3000) })).max(100).optional(),
  offers: z.array(z.string().max(500)).max(50).optional(),
});

export const getSiteContent = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne().lean() || {};
    res.json(content);
  } catch (error) {
    next(error);
  }
};

export const updateSiteContent = async (req, res, next) => {
  try {
    const data = siteContentSchema.parse(req.body);
    let content = await SiteContent.findOne();
    if (!content) {
      content = await SiteContent.create(data);
    } else {
      content = await SiteContent.findOneAndUpdate({}, data, { returnDocument: 'after', runValidators: true });
    }
    res.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ errors: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) });
    next(error);
  }
};

export default {
  getSiteContent,
  updateSiteContent
};
