import express from 'express';
import multer from 'multer';

// Middleware
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

// Validators
import {
  packageSchema,
  destinationSchema,
  roomSchema,
  createGallerySchema,
  updateGallerySchema,
  reviewSchema,
  settingsSchema
} from '../validators/index.js';
import { enquiryUpdateSchema } from '../validators/enquirySchema.js';

// Controllers
import {
  listPackages, getPackage, createPackage, updatePackage, deletePackage
} from '../controllers/packageController.js';
import {
  listDestinations, getDestination, createDestination, updateDestination, deleteDestination
} from '../controllers/destinationController.js';
import {
  listRooms, getRoom, createRoom, updateRoom, deleteRoom
} from '../controllers/roomController.js';
import {
  listGallery, getGalleryItem, createGalleryItem, updateGalleryItem, deleteGalleryItem
} from '../controllers/galleryController.js';
import {
  listReviews, getReview, createReview, updateReview, deleteReview
} from '../controllers/reviewController.js';
import {
  listEnquiries, getEnquiry, updateEnquiry, deleteEnquiry, exportEnquiries
} from '../controllers/enquiryController.js';
import {
  getSettings, updateSettings
} from '../controllers/settingsController.js';
import {
  getSiteContent, updateSiteContent
} from '../controllers/siteContentController.js';
import {
  getDashboard
} from '../controllers/dashboardController.js';
import {
  uploadImage, deleteImageCtrl
} from '../controllers/uploadController.js';

const router = express.Router();

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('Only JPEG, PNG, WEBP, or GIF images are allowed');
      error.status = 400;
      cb(error);
    }
  }
});

// Apply auth to all admin routes
router.use(requireAuth);

// Dashboard
router.get('/dashboard', getDashboard);

// Packages
router.get('/packages', listPackages);
router.post('/packages', validate(packageSchema), createPackage);
router.get('/packages/:id', getPackage);
router.put('/packages/:id', validate(packageSchema), updatePackage);
router.delete('/packages/:id', deletePackage);

// Destinations
router.get('/destinations', listDestinations);
router.post('/destinations', validate(destinationSchema), createDestination);
router.get('/destinations/:id', getDestination);
router.put('/destinations/:id', validate(destinationSchema), updateDestination);
router.delete('/destinations/:id', deleteDestination);

// Rooms
router.get('/rooms', listRooms);
router.post('/rooms', validate(roomSchema), createRoom);
router.get('/rooms/:id', getRoom);
router.put('/rooms/:id', validate(roomSchema), updateRoom);
router.delete('/rooms/:id', deleteRoom);

// Gallery
router.get('/gallery', listGallery);
router.post('/gallery', validate(createGallerySchema), createGalleryItem);
router.get('/gallery/:id', getGalleryItem);
router.put('/gallery/:id', validate(updateGallerySchema), updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

// Reviews
router.get('/reviews', listReviews);
router.post('/reviews', validate(reviewSchema), createReview);
router.get('/reviews/:id', getReview);
router.put('/reviews/:id', validate(reviewSchema), updateReview);
router.delete('/reviews/:id', deleteReview);

// Enquiries
router.get('/enquiries', listEnquiries);
// IMPORTANT: export route MUST come before /:id route
router.get('/enquiries/export', exportEnquiries);
router.get('/enquiries/:id', getEnquiry);
router.put('/enquiries/:id', validate(enquiryUpdateSchema), updateEnquiry);
router.delete('/enquiries/:id', deleteEnquiry);

// Settings (singleton)
router.get('/settings', getSettings);
router.put('/settings', validate(settingsSchema), updateSettings);

// Site Content (singleton)
router.get('/site-content', getSiteContent);
router.put('/site-content', updateSiteContent);

// Upload
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/upload', deleteImageCtrl);

export default router;
