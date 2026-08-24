export const business = {
  businessName: 'Memories for Travellers',
  legalName: 'Memories for Travellars',
  tagline: 'Homestay • Tours • Local Experiences',
  phone: '+919771656111',
  phoneLabel: '+91 97716 56111',
  whatsapp: '919771656111',
  whatsappLabel: '+91 97716 56111',
  email: 'sarfarajansari2002@gmail.com',
  address: 'Darjeeling, West Bengal, India',
  website: 'https://example.com',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d113700.47129921794!2d88.5109639!3d27.0573371!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e41d002d9c4d41%3A0x2745d4d0802e25b4!2sMairung%20Home%20Stay!5e0!3m2!1sen!2sin!4v1787571540752!5m2!1sen!2sin',
  googleBusinessProfile: '',
  instagram: '',
  facebook: '',
  youtube: '',
  openingHours: 'Monday – Sunday: 8:00 AM – 9:00 PM',
  serviceArea: 'Darjeeling • Kalimpong • Sikkim • North Bengal',
  logoText: 'Memories for Travellers',
  colors: {
    dark: '#17231D',
    green: '#2F5D50',
    sage: '#6F8F7A',
    accent: '#D69B55',
    background: '#F8F6F0',
  },
};

export const whatsappUrl = (message = 'Hello, I would like to plan a trip with Memories for Travellers.') =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

export const callUrl = () => `tel:${business.phone}`;
