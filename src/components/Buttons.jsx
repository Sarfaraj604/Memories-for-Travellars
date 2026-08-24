import { MessageCircle, Phone } from 'lucide-react';
import { callUrl, whatsappUrl } from '../config/business';

export function WhatsAppButton({ message, children = 'WhatsApp Us', className = 'accent-btn' }) {
  return <a className={className} href={whatsappUrl(message)} target="_blank" rel="noreferrer"><MessageCircle size={18} />{children}</a>;
}

export function CallButton({ children = 'Call Now', className = 'ghost-btn' }) {
  return <a className={className} href={callUrl()}><Phone size={18} />{children}</a>;
}
