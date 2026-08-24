import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { callUrl, whatsappUrl } from '../config/business';

export default function MobileCTA() {
  return (
    <div className="mobile-cta">
      <a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
      <a href={callUrl()}><Phone size={18} /> Call</a>
      <a href="#enquiry"><CalendarCheck size={18} /> Plan Trip</a>
    </div>
  );
}
