import express from 'express';
import pub from '../controllers/publicController.js';
import { enquiryLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { enquirySchema } from '../validators/enquirySchema.js';

const router = express.Router();

// Public read endpoints require no auth.
router.get('/packages', pub.getPackages);
router.get('/packages/:slug', pub.getPackageBySlug);
router.get('/destinations', pub.getDestinations);
router.get('/rooms', pub.getRooms);
router.get('/gallery', pub.getGallery);
router.get('/reviews', pub.getReviews);
router.get('/settings', pub.getSettings);
router.get('/site-content', pub.getSiteContent);

// Enquiry submission is rate limited and validated.
router.post('/enquiries', enquiryLimiter, validate(enquirySchema), pub.submitEnquiry);

export default router;
