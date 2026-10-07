import { MessageCircle, Phone } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export function WhatsAppButton({ message, children = 'WhatsApp Us', className = 'accent-btn' }) {
  const { whatsappUrl } = useBusiness();
  return <a className={className} href={whatsappUrl(message)} target="_blank" rel="noreferrer"><MessageCircle size={18} />{children}</a>;
}

export function CallButton({ children = 'Call Now', className = 'ghost-btn' }) {
  const { callUrl } = useBusiness();
  return <a className={className} href={callUrl()}><Phone size={18} />{children}</a>;
}
