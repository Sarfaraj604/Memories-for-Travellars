import React, { useState, useEffect } from 'react';
import { adminGetSiteContent, adminUpdateSiteContent } from '../api/siteContent';
import FormField from './components/FormField';
import ImageUploader from './components/ImageUploader';
import { useToast } from './components/Toast';
import { Plus, Trash2 } from 'lucide-react';

export default function SiteContentEditor() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await adminGetSiteContent();
        setFormData(data || { homestay: {}, experiences: [], whyChoose: [], faqs: [], offers: [] });
      } catch (err) {
        toast.error('Failed to load site content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [toast]);

  const handleChange = (section, field, value) => {
    setFormData(prev => section === 'root'
      ? { ...prev, [field]: value }
      : { ...prev, [section]: { ...prev[section], [field]: value } });
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), defaultValue] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const newArray = [...(prev[field] || [])];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateSiteContent(formData);
      toast.success('Site content updated');
    } catch (err) {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Site Content</h2>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Content'}
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Homestay Info</h3>
        </div>
        <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Intro Text" className="col-span-2">
            <textarea className="admin-textarea" value={formData.homestay?.intro || ''} onChange={e => handleChange('homestay', 'intro', e.target.value)} />
          </FormField>
          <FormField label="Location">
            <input type="text" className="admin-input" value={formData.homestay?.location || ''} onChange={e => handleChange('homestay', 'location', e.target.value)} />
          </FormField>
          <FormField label="Room Info">
            <input type="text" className="admin-input" value={formData.homestay?.roomInfo || ''} onChange={e => handleChange('homestay', 'roomInfo', e.target.value)} />
          </FormField>
          <FormField label="Check In">
            <input type="text" className="admin-input" value={formData.homestay?.checkIn || ''} onChange={e => handleChange('homestay', 'checkIn', e.target.value)} />
          </FormField>
          <FormField label="Check Out">
            <input type="text" className="admin-input" value={formData.homestay?.checkOut || ''} onChange={e => handleChange('homestay', 'checkOut', e.target.value)} />
          </FormField>
          <FormField label="Guest Capacity">
            <input type="text" className="admin-input" value={formData.homestay?.guestCapacity || ''} onChange={e => handleChange('homestay', 'guestCapacity', e.target.value)} />
          </FormField>
          <FormField label="Amenities (comma separated)">
            <input type="text" className="admin-input" value={formData.homestay?.amenities?.join(', ') || ''} onChange={e => handleChange('homestay', 'amenities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          </FormField>
          <FormField label="Homestay Image">
            <ImageUploader 
              value={formData.homestay?.image || ''} 
              folder="site"
              onChange={(url) => handleChange('homestay', 'image', url)}
              onRemove={() => handleChange('homestay', 'image', '')}
            />
          </FormField>
        </div>
      </div>
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header"><h3 className="admin-card-title">Hero Image</h3></div>
        <div className="admin-card-body">
          <ImageUploader value={formData.heroImage || ''} folder="site" onChange={(url) => handleChange('root', 'heroImage', url)} onRemove={() => handleChange('root', 'heroImage', '')} />
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 className="admin-card-title">Why Choose Us</h3>
          <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('whyChoose')}>Add Reason</button>
        </div>
        <div className="admin-card-body">
          {formData.whyChoose?.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input type="text" className="admin-input" value={item} onChange={e => handleArrayChange('whyChoose', i, e.target.value)} />
              <button type="button" className="admin-btn-icon" onClick={() => removeArrayItem('whyChoose', i)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {['experiences', 'offers'].map((field) => (
        <div className="admin-card" style={{ marginBottom: '2rem' }} key={field}>
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="admin-card-title">{field === 'experiences' ? 'Experiences' : 'Offers'}</h3>
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem(field)}>Add</button>
          </div>
          <div className="admin-card-body">
            {(formData[field] || []).map((item, index) => <div key={`${field}-${index}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input className="admin-input" value={item} onChange={(event) => handleArrayChange(field, index, event.target.value)} />
              <button type="button" className="admin-btn-icon" onClick={() => removeArrayItem(field, index)}><Trash2 size={16} /></button>
            </div>)}
          </div>
        </div>
      ))}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 className="admin-card-title">Frequently Asked Questions</h3>
          <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('faqs', { question: '', answer: '' })}>Add FAQ</button>
        </div>
        <div className="admin-card-body">
          {(formData.faqs || []).map((faq, index) => <div key={`faq-${index}`} style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
            <input className="admin-input" aria-label="Question" placeholder="Question" value={faq.question || ''} onChange={(event) => handleArrayChange('faqs', index, { ...faq, question: event.target.value })} />
            <textarea className="admin-textarea" aria-label="Answer" placeholder="Answer" value={faq.answer || ''} onChange={(event) => handleArrayChange('faqs', index, { ...faq, answer: event.target.value })} />
            <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeArrayItem('faqs', index)}>Remove FAQ</button>
          </div>)}
        </div>
      </div>
      </form>
    </div>
  );
}
