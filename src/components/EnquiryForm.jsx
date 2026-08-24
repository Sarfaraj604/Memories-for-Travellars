import { useState } from 'react';
import { Send } from 'lucide-react';
import { whatsappUrl } from '../config/business';
import { packages } from '../data/packages';

export default function EnquiryForm({ selectedPackage = '' }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', destination: '', tourPackage: selectedPackage, date: '', guests: '', nights: '', tripType: '', budget: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
  event.preventDefault();

  if (!form.name.trim() || !form.phone.trim()) {
    setError('Please add your full name and phone number.');
    setStatus('error');
    return;
  }

  setStatus('loading');
  setError('');

  try {
    const response = await fetch('https://formspree.io/f/xjybdneg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        destination: form.destination,
        tourPackage: form.tourPackage,
        travelDate: form.date,
        guests: form.guests,
        nights: form.nights,
        tripType: form.tripType,
        budget: form.budget,
        message: form.message,
      }),
    });

    if (response.ok) {
      setStatus('success');

      setForm({
        name: '',
        phone: '',
        email: '',
        destination: '',
        tourPackage: selectedPackage,
        date: '',
        guests: '',
        nights: '',
        tripType: '',
        budget: '',
        message: '',
      });
    } else {
      throw new Error('Failed to send enquiry');
    }
  } catch (err) {
    setError('Something went wrong. Please try again or contact us on WhatsApp.');
    setStatus('error');
  }
};
  const whatsappMessage = `Hello, I am ${form.name || '[NAME]'}. I want to enquire about ${form.tourPackage || form.destination || 'a trip'} for ${form.guests || '[GUESTS]'} guest(s). Travel date: ${form.date || '[DATE]'}.`;

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>Full Name<input required value={form.name} onChange={(e) => set('name', e.target.value)} /></label>
        <label>Phone<input required value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
        <label>Destination<input value={form.destination} onChange={(e) => set('destination', e.target.value)} /></label>
        <label>Tour Package<select value={form.tourPackage} onChange={(e) => set('tourPackage', e.target.value)}><option value="">Custom / Not decided</option>{packages.map((pkg) => <option key={pkg.slug}>{pkg.name}</option>)}</select></label>
        <label>Travel Date<input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></label>
        <label>Number of Guests<input type="number" min="1" value={form.guests} onChange={(e) => set('guests', e.target.value)} /></label>
        <label>Number of Nights<input type="number" min="1" value={form.nights} onChange={(e) => set('nights', e.target.value)} /></label>
        <label>Trip Type<select value={form.tripType} onChange={(e) => set('tripType', e.target.value)}><option value="">Select</option>{['Family', 'Couple', 'Friends', 'Solo', 'Adventure', 'Relaxation', 'Custom Trip'].map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Budget<input value={form.budget} onChange={(e) => set('budget', e.target.value)} placeholder="₹XXXX" /></label>
        <label className="full">Message<textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows="4" /></label>
      </div>
      {status === 'error' && <p className="form-error">{error}</p>}
      {status === 'success' && <p className="form-success">Thank you! Your enquiry has been received. Memories for Travellers will contact you shortly.</p>}
      <div className="form-actions">
        <button type="submit" className="accent-btn" disabled={status === 'loading'}><Send size={18} /> {status === 'loading' ? 'Sending...' : 'Send Enquiry'}</button>
        <a className="ghost-btn" href={whatsappUrl(whatsappMessage)} target="_blank" rel="noreferrer">Continue on WhatsApp</a>
      </div>
    </form>
  );
}
