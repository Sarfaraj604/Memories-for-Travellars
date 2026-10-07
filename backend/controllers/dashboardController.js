import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import Room from '../models/Room.js';
import Gallery from '../models/Gallery.js';
import Review from '../models/Review.js';
import Enquiry from '../models/Enquiry.js';

export const getDashboard = async (req, res, next) => {
  try {
    const [
      packagesTotal,
      packagesActive,
      packagesFeatured,
      destinationsTotal,
      roomsTotal,
      galleryTotal,
      reviewsTotal,
      reviewsPublished,
      enquiriesTotal,
      enquiriesNew,
      enquiriesContacted,
      enquiriesConverted,
      enquiriesClosed,
      recentEnquiries
    ] = await Promise.all([
      Package.countDocuments(),
      Package.countDocuments({ active: true }),
      Package.countDocuments({ featured: true }),
      Destination.countDocuments(),
      Room.countDocuments(),
      Gallery.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ published: true }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'contacted' }),
      Enquiry.countDocuments({ status: 'converted' }),
      Enquiry.countDocuments({ status: 'closed' }),
      Enquiry.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      // Keep these count names consistent with the dashboard cards.
      counts: {
        packages: packagesTotal,
        activePackages: packagesActive,
        featuredPackages: packagesFeatured,
        destinations: destinationsTotal,
        rooms: roomsTotal,
        gallery: galleryTotal,
        reviews: reviewsTotal,
        publishedReviews: reviewsPublished,
        enquiries: enquiriesTotal,
        newEnquiries: enquiriesNew
      },
      packages: {
        total: packagesTotal,
        active: packagesActive,
        featured: packagesFeatured
      },
      destinations: destinationsTotal,
      rooms: roomsTotal,
      gallery: galleryTotal,
      reviews: {
        total: reviewsTotal,
        published: reviewsPublished
      },
      enquiries: {
        total: enquiriesTotal,
        byStatus: {
          new: enquiriesNew,
          contacted: enquiriesContacted,
          converted: enquiriesConverted,
          closed: enquiriesClosed
        },
        recent: recentEnquiries
      }
    });
  } catch (error) {
    next(error);
  }
};

export default { getDashboard };
