import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import Room from '../models/Room.js';
import Gallery from '../models/Gallery.js';
import Review from '../models/Review.js';
import Settings from '../models/Settings.js';
import SiteContent from '../models/SiteContent.js';
import Enquiry from '../models/Enquiry.js';

const cleanImage = (item, fields = ['image']) => {
  for (const field of fields) {
    if (Array.isArray(item[field])) {
      item[field] = item[field].map((image) => typeof image === 'string' && /^https:\/\//i.test(image) ? image : '').filter(Boolean);
    } else if (typeof item[field] === 'string' && !/^https:\/\//i.test(item[field])) item[field] = '';
  }
  return item;
};

// Packages

export const getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json(packages.map((item) => cleanImage(item, ['image', 'gallery'])));
  } catch (error) {
    next(error);
  }
};

export const getPackageBySlug = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug, active: true }).lean();
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(cleanImage(pkg, ['image', 'gallery']));
  } catch (error) {
    next(error);
  }
};

// Destinations

export const getDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find({ active: true })
      .sort({ order: 1 })
      .lean();
    res.json(destinations.map((item) => cleanImage(item)));
  } catch (error) {
    next(error);
  }
};

// Rooms

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ active: true })
      .sort({ order: 1 })
      .lean();
    res.json(rooms.map((item) => cleanImage(item)));
  } catch (error) {
    next(error);
  }
};

// Gallery

export const getGallery = async (req, res, next) => {
  try {
    const images = await Gallery.find({ active: true })
      .sort({ order: 1 })
      .lean();
    res.json(images.map((item) => cleanImage(item, ['src'])));
  } catch (error) {
    next(error);
  }
};

// Reviews

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Settings

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne().lean() || {};
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Site Content

export const getSiteContent = async (req, res, next) => {
  try {
    const content = await SiteContent.findOne().lean() || {};
    res.json(content);
  } catch (error) {
    next(error);
  }
};

// Enquiry Submission

export const submitEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({
      message: 'Enquiry submitted successfully. We will contact you shortly.',
      id: enquiry._id,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPackages,
  getPackageBySlug,
  getDestinations,
  getRooms,
  getGallery,
  getReviews,
  getSettings,
  getSiteContent,
  submitEnquiry,
};
