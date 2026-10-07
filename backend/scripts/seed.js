import '../config/env.js';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';

// Models
import Admin from '../models/Admin.js';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import Room from '../models/Room.js';
import Gallery from '../models/Gallery.js';
import Review from '../models/Review.js';
import Settings from '../models/Settings.js';
import SiteContent from '../models/SiteContent.js';

// --- Data to Seed ---

const packages = [
  {
    name: 'Darjeeling Escape',
    slug: 'darjeeling-escape',
    destination: 'Darjeeling',
    shortDescription: 'A calm mountain itinerary with viewpoints, tea gardens and flexible sightseeing.',
    description: 'A configurable sample package for guests who want a gentle hill journey. Replace every detail with the final business itinerary before publishing.',
    price: 'Rs 9,999',
    durationDays: 5,
    nights: 4,
    guests: 'Custom',
    tripType: ['Family', 'Couple', 'Relaxation'],
    tags: ['Nature', 'Sightseeing', 'Relaxation'],
    featured: true,
    active: true,
    image: 'https://specialplacesofindia.com/wp-content/uploads/2025/07/Darjeeling-1024x524.jpg',
    gallery: ['https://images.unsplash.com/photo-1544634076-a90160ddf3c4?auto=format&fit=crop&w=1400&q=80'],
    highlights: ['Tea garden visit', 'Scenic viewpoints', 'Local sightseeing plan', 'Customizable pacing'],
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', description: 'Arrive, settle in and review the route with the local team.', places: ['Arrival point', 'Homestay / hotel'], accommodation: 'Configurable stay' },
      { day: 2, title: 'Local Sightseeing', description: 'Cover selected local attractions based on weather and guest preference.', places: ['Viewpoints', 'Tea garden'] },
      { day: 3, title: 'Destination Exploration', description: 'A flexible exploration day with time for photography and slow travel.' },
      { day: 4, title: 'Experience Day', description: 'Optional cultural, food or nature experiences can be added.' },
      { day: 5, title: 'Departure', description: 'Check out and depart with assistance for onward travel.' },
    ],
    inclusions: ['Custom itinerary planning', 'Local assistance', 'Accommodation details as confirmed'],
    exclusions: ['Personal expenses', 'Entry fees unless specified', 'Anything not listed in final confirmation'],
    accommodation: 'To be confirmed based on availability.',
    transportation: 'Available on request.',
    importantInfo: ['Prices and availability must be confirmed by the business.', 'This is placeholder package content.'],
    faqs: [{ question: 'Can this package be customized?', answer: 'Yes. The final route, stay and inclusions can be customized after enquiry.' }],
    order: 1,
  },
  {
    name: 'Sikkim Discovery',
    slug: 'sikkim-discovery',
    destination: 'Sikkim',
    shortDescription: 'A customizable mountain route for viewpoints, local culture and nature.',
    description: 'A configurable sample route for Sikkim-bound travellers. Confirm permits, routing and seasonality before publishing.',
    price: 'Rs XXXX',
    durationDays: 6,
    nights: 5,
    guests: 'Custom',
    tripType: ['Family', 'Friends', 'Adventure'],
    tags: ['Mountains', 'Culture', 'Adventure'],
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=80'],
    highlights: ['Flexible route', 'Permit guidance placeholder', 'Mountain sightseeing', 'Local support'],
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive and check in.' },
      { day: 2, title: 'Scenic Tour', description: 'Visit planned scenic points.' },
      { day: 3, title: 'Mountain Day', description: 'Explore higher altitude destinations if conditions allow.' },
      { day: 4, title: 'Culture & Food', description: 'Local food and cultural stops.' },
      { day: 5, title: 'Leisure', description: 'Relaxed day or optional activities.' },
      { day: 6, title: 'Departure', description: 'Depart after breakfast or as scheduled.' },
    ],
    inclusions: ['Itinerary planning', 'Local coordination'],
    exclusions: ['Permits unless confirmed', 'Meals unless specified', 'Personal expenses'],
    accommodation: 'To be confirmed.',
    transportation: 'Available on request.',
    importantInfo: ['Route depends on weather, permits and local conditions.'],
    order: 2,
  },
  {
    name: 'Dooars Nature Break',
    slug: 'dooars-nature-break',
    destination: 'Dooars',
    shortDescription: 'A nature-focused short break with forests, rivers and slow travel.',
    description: 'A placeholder nature package designed to be replaced with final Dooars inclusions and activities.',
    price: 'Rs XXXX',
    durationDays: 4,
    nights: 3,
    guests: 'Custom',
    tripType: ['Family', 'Friends', 'Relaxation'],
    tags: ['Nature', 'Wildlife', 'Relaxation'],
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1400&q=80'],
    highlights: ['Forest-side stays', 'River views', 'Relaxed itinerary', 'Optional safari support'],
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive and settle into the stay.' },
      { day: 2, title: 'Nature Trail', description: 'Explore nature points and local views.' },
      { day: 3, title: 'Experience Day', description: 'Optional safari or village experience can be planned.' },
      { day: 4, title: 'Departure', description: 'Check out and onward journey.' },
    ],
    inclusions: ['Planning assistance', 'Stay coordination'],
    exclusions: ['Safari charges unless confirmed', 'Entry fees', 'Meals unless specified'],
    accommodation: 'To be confirmed.',
    transportation: 'Available on request.',
    importantInfo: ['Activities are subject to local rules and availability.'],
    order: 3,
  },
  {
    name: 'Kalimpong Escape',
    slug: 'kalimpong-escape',
    destination: 'Kalimpong',
    shortDescription: 'A calm mountain itinerary with viewpoints, monasteries, tea gardens and flexible sightseeing.',
    description: 'A configurable sample package for guests who want a gentle Kalimpong hill journey. Replace every detail with the final business itinerary before publishing.',
    price: 'Rs 9,999',
    durationDays: 5,
    nights: 4,
    guests: 'Custom',
    tripType: ['Family', 'Couple', 'Relaxation'],
    tags: ['Nature', 'Sightseeing', 'Relaxation'],
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1544634076-a90160ddf3c4?auto=format&fit=crop&w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1544634076-a90160ddf3c4?auto=format&fit=crop&w=1400&q=80'],
    highlights: ['Tea garden visit', 'Scenic viewpoints', 'Monastery visit', 'Customizable pacing'],
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', description: 'Arrive in Kalimpong, settle in and review the route with the local team.', places: ['Arrival point', 'Homestay / hotel'], accommodation: 'Configurable stay' },
      { day: 2, title: 'Local Sightseeing', description: 'Cover selected local attractions based on weather and guest preference.', places: ['Deolo Hill', 'Durpin Dara', 'Monastery'] },
      { day: 3, title: 'Destination Exploration', description: 'Explore Kalimpong with time for photography, local markets and slow travel.' },
      { day: 4, title: 'Experience Day', description: 'Optional cultural, food, tea garden or nature experiences can be added.' },
      { day: 5, title: 'Departure', description: 'Check out and depart with assistance for onward travel.' },
    ],
    inclusions: ['Custom itinerary planning', 'Local assistance', 'Accommodation details as confirmed'],
    exclusions: ['Personal expenses', 'Entry fees unless specified', 'Anything not listed in final confirmation'],
    accommodation: 'To be confirmed based on availability.',
    transportation: 'Available on request.',
    importantInfo: ['Prices and availability must be confirmed by the business.', 'This is placeholder package content.'],
    faqs: [{ question: 'Can this package be customized?', answer: 'Yes. The final route, stay and inclusions can be customized after enquiry.' }],
    order: 4,
  },
  {
    name: 'Mirik Mountain Escape',
    slug: 'mirik-mountain-escape',
    destination: 'Mirik',
    shortDescription: 'A peaceful hill itinerary with a lake, tea gardens, viewpoints and relaxed sightseeing.',
    description: 'A configurable sample package for guests who want a peaceful Mirik hill journey. Replace every detail with the final business itinerary before publishing.',
    price: 'Rs 9,999',
    durationDays: 5,
    nights: 4,
    guests: 'Custom',
    tripType: ['Family', 'Couple', 'Relaxation'],
    tags: ['Nature', 'Sightseeing', 'Relaxation'],
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80'],
    highlights: ['Mirik Lake visit', 'Tea garden visit', 'Scenic viewpoints', 'Customizable pacing'],
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', description: 'Arrive in Mirik, settle in and review the route with the local team.', places: ['Arrival point', 'Homestay / hotel'], accommodation: 'Configurable stay' },
      { day: 2, title: 'Lake & Local Sightseeing', description: 'Explore Mirik Lake and selected local attractions based on weather and guest preference.', places: ['Mirik Lake', 'Viewpoints'] },
      { day: 3, title: 'Tea Garden Exploration', description: 'Enjoy a relaxed day exploring tea gardens, local surroundings and scenic mountain views.' },
      { day: 4, title: 'Experience Day', description: 'Optional cultural, food or nature experiences can be added.' },
      { day: 5, title: 'Departure', description: 'Check out and depart with assistance for onward travel.' },
    ],
    inclusions: ['Custom itinerary planning', 'Local assistance', 'Accommodation details as confirmed'],
    exclusions: ['Personal expenses', 'Entry fees unless specified', 'Anything not listed in final confirmation'],
    accommodation: 'To be confirmed based on availability.',
    transportation: 'Available on request.',
    importantInfo: ['Prices and availability must be confirmed by the business.', 'This is placeholder package content.'],
    faqs: [{ question: 'Can this package be customized?', answer: 'Yes. The final route, stay and inclusions can be customized after enquiry.' }],
    order: 5,
  },
  {
    name: 'Lava Loleygaon Nature Break',
    slug: 'lava-loleygaon-nature-break',
    destination: 'Lava & Loleygaon',
    shortDescription: 'A nature-focused mountain break with forests, viewpoints, monasteries and slow travel.',
    description: 'A configurable sample package designed for guests looking for a peaceful forest and mountain experience around Lava and Loleygaon. Replace every detail with the final business itinerary before publishing.',
    price: 'Rs 9,999',
    durationDays: 5,
    nights: 4,
    guests: 'Custom',
    tripType: ['Family', 'Friends', 'Relaxation'],
    tags: ['Nature', 'Wildlife', 'Relaxation'],
    featured: true,
    active: true,
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1400&q=80',
    gallery: ['https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1400&q=80'],
    highlights: ['Forest-side stays', 'Mountain viewpoints', 'Monastery visit', 'Relaxed itinerary'],
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', description: 'Arrive in Lava, settle into the stay and review the route with the local team.', places: ['Arrival point', 'Homestay / hotel'], accommodation: 'Configurable stay' },
      { day: 2, title: 'Lava Nature Tour', description: 'Explore forest areas, viewpoints and selected local attractions.', places: ['Lava Monastery', 'Forest viewpoints'] },
      { day: 3, title: 'Loleygaon Exploration', description: 'Explore Loleygaon and enjoy scenic forest surroundings and slow travel.' },
      { day: 4, title: 'Experience Day', description: 'Optional nature, village, food or photography experiences can be added.' },
      { day: 5, title: 'Departure', description: 'Check out and depart with assistance for onward travel.' },
    ],
    inclusions: ['Custom itinerary planning', 'Local assistance', 'Accommodation details as confirmed'],
    exclusions: ['Personal expenses', 'Entry fees unless specified', 'Anything not listed in final confirmation'],
    accommodation: 'To be confirmed based on availability.',
    transportation: 'Available on request.',
    importantInfo: ['Prices and availability must be confirmed by the business.', 'This is placeholder package content.'],
    faqs: [{ question: 'Can this package be customized?', answer: 'Yes. The final route, stay and inclusions can be customized after enquiry.' }],
    order: 6,
  },
];

const destinations = [
  { name: 'Darjeeling', slug: 'darjeeling', description: 'Tea gardens, viewpoints and slow mountain days.', image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', active: true, order: 1 },
  { name: 'Kalimpong', slug: 'kalimpong', description: 'Hill town calm, local markets and scenic stays.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', active: true, order: 2 },
  { name: 'Sikkim', slug: 'sikkim', description: 'Mountains, monasteries and customizable journeys.', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80', active: true, order: 3 },
  { name: 'Dooars', slug: 'dooars', description: 'Forests, rivers and nature-focused breaks.', image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80', active: true, order: 4 },
  { name: 'North Bengal', slug: 'north-bengal', description: 'Flexible regional itineraries for families and groups.', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80', active: true, order: 5 },
];

const rooms = [
  { name: 'Premium Family Room', slug: 'premium-family-room', description: 'A configurable room listing for families who want comfort, privacy and easy assistance.', price: 'Rs 2,999 / night', maxGuests: '[MAX GUESTS]', bedType: '[BED TYPE]', amenities: ['Wi-Fi', 'Parking', 'Hot Water', 'Attached Bathroom'], image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80', active: true, order: 1 },
  { name: 'Nature View Room', slug: 'nature-view-room', description: 'A calm placeholder room type with a replaceable image and editable amenities.', price: 'Rs XXXX / night', maxGuests: '[MAX GUESTS]', bedType: '[BED TYPE]', amenities: ['Nature View', 'Breakfast', 'Local Assistance'], image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=80', active: true, order: 2 },
  { name: 'Couple Comfort Room', slug: 'couple-comfort-room', description: 'A cozy configurable room card for couple stays and short breaks.', price: 'Rs XXXX / night', maxGuests: '[MAX GUESTS]', bedType: '[BED TYPE]', amenities: ['Attached Bathroom', 'Hot Water', 'Family Friendly'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=80', active: true, order: 3 },
];

const galleryItems = [
  { category: 'Homestay', title: 'Replaceable homestay image', src: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80', alt: 'Homestay property image', active: true, order: 1 },
  { category: 'Rooms', title: 'Replaceable room image', src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', alt: 'Room interior image', active: true, order: 2 },
  { category: 'Destinations', title: 'Replaceable destination image', src: '/images/destination-image.jpg', alt: 'Destination landscape image', active: true, order: 3 },
  { category: 'Tours', title: 'Replaceable tour image', src: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80', alt: 'Tour activity image', active: true, order: 4 },
  { category: 'Experiences', title: 'Replaceable experience image', src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', alt: 'Travel experience image', active: true, order: 5 },
  { category: 'Food', title: 'Replaceable food image', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', alt: 'Local food image', active: true, order: 6 },
  { category: 'Nature', title: 'Replaceable nature image', src: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80', alt: 'Nature landscape image', active: true, order: 7 },
];

const reviewsData = [
  { name: 'Rahul Sharma', rating: 5, review: 'A wonderful stay with clean rooms, beautiful views, and very friendly service. The location was perfect for exploring Darjeeling.', date: 'June 2026', published: true, order: 1 },
  { name: 'Priya Das', rating: 4, review: 'The homestay was comfortable and peaceful. The staff were helpful and the breakfast was good. We had a lovely experience.', date: 'May 2026', published: true, order: 2 },
  { name: 'Amit Roy', rating: 5, review: 'Really enjoyed our stay here. The room was neat and comfortable, and the mountain view was beautiful. Highly recommended for families.', date: 'April 2026', published: true, order: 3 },
  { name: 'Sneha Kapoor', rating: 5, review: 'A cozy place with great hospitality. The staff helped us arrange local sightseeing and made our trip very convenient.', date: 'March 2026', published: true, order: 4 },
];

const settings = {
  businessName: 'Memories for Travellers',
  legalName: 'Memories for Travellars',
  tagline: 'Homestay - Tours - Local Experiences',
  phone: '+919771656111',
  phoneLabel: '+91 97716 56111',
  whatsapp: '919771656111',
  whatsappLabel: '+91 97716 56111',
  email: 'sarfarajansari2002@gmail.com',
  address: 'Darjeeling, West Bengal, India',
  website: '',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d113700.47129921794!2d88.5109639!3d27.0573371!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e41d002d9c4d41%3A0x2745d4d0802e25b4!2sMairung%20Home%20Stay!5e0!3m2!1sen!2sin!4v1787571540752!5m2!1sen!2sin',
  googleBusinessProfile: '',
  instagram: '',
  facebook: '',
  youtube: '',
  openingHours: 'Monday - Sunday: 8:00 AM - 9:00 PM',
  serviceArea: 'Darjeeling - Kalimpong - Sikkim - North Bengal',
  logoText: 'Memories for Travellers',
  colors: { dark: '#17231D', green: '#2F5D50', sage: '#6F8F7A', accent: '#D69B55', background: '#F8F6F0' },
};

const siteContent = {
  homestay: {
    intro: 'Enjoy a peaceful and comfortable stay at our welcoming homestay, surrounded by beautiful nature and local charm. It is an ideal choice for families, couples, and travellers looking for a relaxing base while exploring nearby attractions and destinations.',
    location: 'Darjeeling, West Bengal',
    roomInfo: 'Deluxe Double Room',
    checkIn: '12:00 PM',
    checkOut: '10:00 AM',
    guestCapacity: 'Up to 3 Guests per Room',
    amenities: ['Wi-Fi', 'Parking', 'Hot Water', 'Attached Bathroom', 'Breakfast', 'Nature View', 'Family Friendly', 'Local Assistance'],
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1600&q=80',
  },
  experiences: ['Local Sightseeing', 'Nature', 'Adventure', 'Local Food', 'Culture', 'Photography', 'Sunrise/Sunset', 'Village Experience'],
  whyChoose: ['Local Knowledge', 'Comfortable Stay', 'Personalized Trips', 'Transparent Information', 'Easy Enquiry', 'Local Assistance', 'Flexible Itineraries', 'Friendly Support'],
  faqs: [
    { question: 'How can I book a tour?', answer: 'Send an enquiry or message on WhatsApp. The team will confirm availability, route and pricing before booking.' },
    { question: 'Can I customize a package?', answer: 'Yes. Packages are designed to be adjustable based on destination, dates, guests and travel style.' },
    { question: 'How can I book a room?', answer: 'Use the room enquiry button or contact the business directly for availability confirmation.' },
    { question: 'What is included?', answer: 'Inclusions depend on the final package confirmation and are listed clearly before booking.' },
    { question: 'What is excluded?', answer: 'Personal expenses and items not included in the confirmed itinerary are excluded.' },
    { question: 'What are check-in/check-out times?', answer: 'Current placeholder: [CHECK-IN TIME] and [CHECK-OUT TIME].' },
    { question: 'Do you provide transportation?', answer: 'Transportation can be discussed during enquiry and confirmed based on availability.' },
    { question: 'How does payment work?', answer: 'Payment terms should be confirmed directly with Memories for Travellers before booking.' },
    { question: 'What is the cancellation policy?', answer: '[CANCELLATION POLICY]' },
    { question: 'How can I contact Memories for Travellers?', answer: 'Use WhatsApp, call, email or the enquiry form on the website.' },
  ],
  offers: [],
};

// --- Seeding Logic ---

const seedDatabase = async () => {
  try {
    const adminOnly = process.env.SEED_ADMIN_ONLY === 'true';
    if (process.env.SEED_DEMO_DATA !== 'true' && !adminOnly) {
      throw new Error('Seeding is disabled by default. Set SEED_ADMIN_ONLY=true to bootstrap only the admin, or SEED_DEMO_DATA=true for inactive demo records.');
    }
    await connectDB();
    console.log('Connected to MongoDB.');

    // Seed Admin
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(process.env.ADMIN_PASSWORD)) {
        throw new Error('ADMIN_PASSWORD must be at least 12 characters and include upper, lower, numeric, and symbol characters.');
      }
      const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        await Admin.create({
          name: 'Admin',
          email: process.env.ADMIN_EMAIL,
          passwordHash: process.env.ADMIN_PASSWORD,
        });
        console.log('[OK] Admin user created.');
      } else {
        // Explicitly running the admin-only bootstrap is the operator's recovery
        // path for a forgotten password. Keep normal demo-data seeding non-invasive.
        if (adminOnly) {
          adminExists.setPassword(process.env.ADMIN_PASSWORD);
          adminExists.refreshTokenHash = null;
          await adminExists.save();
          console.log('[OK] Existing admin password updated and sessions revoked.');
        } else {
          console.log('[INFO] Admin user already exists; password was not changed.');
        }
      }
    } else {
      if (adminOnly) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required when SEED_ADMIN_ONLY=true.');
      console.log('[WARN] ADMIN_EMAIL or ADMIN_PASSWORD missing from .env, skipping admin creation.');
    }

    if (adminOnly) {
      console.log('[DONE] Admin-only bootstrap completed; no content collections were changed.');
      await mongoose.disconnect();
      return;
    }

    // Seed Packages
    if (await Package.countDocuments() === 0) {
      await Package.insertMany(packages.map((item) => ({ ...item, name: `[DEMO] ${item.name}`, description: 'Inactive demo record. Replace with verified package details before publishing.', price: '', active: false, image: '', gallery: [] })));
      console.log('[OK] Inactive demo packages seeded.');
    } else {
      console.log('[INFO] Packages collection not empty, skipping.');
    }

    // Seed Destinations
    if (await Destination.countDocuments() === 0) {
      await Destination.insertMany(destinations.map((item) => ({ ...item, name: `[DEMO] ${item.name}`, description: 'Inactive demo destination. Replace with verified information before publishing.', active: false, image: '' })));
      console.log('[OK] Inactive demo destinations seeded.');
    } else {
      console.log('[INFO] Destinations collection not empty, skipping.');
    }

    // Seed Rooms
    if (await Room.countDocuments() === 0) {
      await Room.insertMany(rooms.map((item) => ({ ...item, name: `[DEMO] ${item.name}`, description: 'Inactive demo room. Replace with verified room details and rates before publishing.', price: '', maxGuests: '', bedType: '', active: false, image: '' })));
      console.log('[OK] Inactive demo rooms seeded.');
    } else {
      console.log('[INFO] Rooms collection not empty, skipping.');
    }

    console.log('[INFO] Gallery left empty; upload verified images through the admin panel.');

    // Seed Reviews
    if (await Review.countDocuments() === 0) {
      await Review.insertMany(reviewsData.map((item) => ({ ...item, name: `[DEMO] ${item.name}`, review: 'Inactive demo review. Replace with a verified customer review before publishing.', published: false })));
      console.log('[OK] Unpublished demo reviews seeded.');
    } else {
      console.log('[INFO] Reviews collection not empty, skipping.');
    }

    // Seed Settings
    if (await Settings.countDocuments() === 0) {
      await Settings.create(settings);
      console.log('[OK] Settings seeded.');
    } else {
      console.log('[INFO] Settings collection not empty, skipping.');
    }

    // Seed SiteContent
    if (await SiteContent.countDocuments() === 0) {
      await SiteContent.create({ ...siteContent, homestay: { ...siteContent.homestay, intro: 'Demo content. Add verified homestay details before publishing.', image: '' }, heroImage: '', experiences: [], whyChoose: [], faqs: [], offers: [] });
      console.log('[OK] SiteContent seeded.');
    } else {
      console.log('[INFO] SiteContent collection not empty, skipping.');
    }

    console.log('[DONE] Missing seed collections were populated; existing records were preserved.');
  } catch (error) {
    console.error('[ERROR] Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  }
};

seedDatabase();
