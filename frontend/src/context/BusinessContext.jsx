import { createContext, useContext, useEffect, useState } from 'react';
import { fetchSettings } from '../api/settings';
import { fetchSiteContent } from '../api/siteContent';

const BusinessContext = createContext(null);

// Default fallback so the site works even if the API is down
const defaultBusiness = {
  businessName: 'Memories for Travellers',
  legalName: 'Memories for Travellars',
  tagline: 'Homestay - Tours - Local Experiences',
  phone: '',
  phoneLabel: '',
  whatsapp: '',
  whatsappLabel: '',
  email: '',
  address: '',
  website: '',
  googleMapsUrl: '',
  googleBusinessProfile: '',
  instagram: '',
  facebook: '',
  youtube: '',
  openingHours: '',
  serviceArea: '',
  logoText: 'Memories for Travellers',
  colors: { dark: '#17231D', green: '#2F5D50', sage: '#6F8F7A', accent: '#D69B55', background: '#F8F6F0' },
};

const defaultSiteContent = {
  homestay: { intro: '', location: '', roomInfo: '', checkIn: '', checkOut: '', guestCapacity: '', amenities: [], image: '' },
  experiences: [],
  whyChoose: [],
  faqs: [],
  offers: [],
};

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(defaultBusiness);
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const retryDelay = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
      let lastError;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const [settings, content] = await Promise.all([fetchSettings(), fetchSiteContent()]);
          if (!cancelled) {
            setBusiness({ ...defaultBusiness, ...(settings || {}) });
            setSiteContent(content || defaultSiteContent);
            setError(null);
          }
          lastError = null;
          break;
        } catch (loadError) {
          lastError = loadError;
          if (attempt < 2) await retryDelay(300 * (attempt + 1));
        }
      }

      if (!cancelled && lastError) {
        // Keep the built-in business defaults usable; raw network/database
        // errors are implementation details and should not appear on the site.
        setError('Business settings are temporarily unavailable.');
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const whatsappUrl = (message = `Hello, I would like to plan a trip with ${business.businessName}.`) =>
    `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

  const callUrl = () => `tel:${business.phone}`;

  return (
    <BusinessContext.Provider value={{ business, siteContent, whatsappUrl, callUrl, loading, error }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used inside BusinessProvider');
  return ctx;
}
