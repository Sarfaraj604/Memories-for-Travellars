import React, { useState, useEffect } from 'react';
import { adminGetSettings, adminUpdateSettings } from '../api/settings';
import FormField from './components/FormField';
import ImageUploader from './components/ImageUploader';
import { useToast } from './components/Toast';

export default function SettingsEditor() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminGetSettings();
        setFormData(data || {});
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateSettings(formData);
      toast.success('Settings updated');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>General Settings</h2>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Business Information</h3>
        </div>
        <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Business Name">
            <input type="text" className="admin-input" name="businessName" value={formData.businessName || ''} onChange={handleChange} />
          </FormField>
          <FormField label="Legal Name">
            <input type="text" className="admin-input" name="legalName" value={formData.legalName || ''} onChange={handleChange} />
          </FormField>
          <FormField label="Tagline">
            <input type="text" className="admin-input" name="tagline" value={formData.tagline || ''} onChange={handleChange} />
          </FormField>
          <FormField label="Email Address">
            <input type="email" className="admin-input" name="email" value={formData.email || ''} onChange={handleChange} />
          </FormField>
          <FormField label="Phone Number">
            <input type="text" className="admin-input" name="phone" value={formData.phone || ''} onChange={handleChange} />
          </FormField>
          <FormField label="WhatsApp Number">
            <input type="text" className="admin-input" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} />
          </FormField>
          <FormField label="Address" className="col-span-2">
            <textarea className="admin-textarea" name="address" value={formData.address || ''} onChange={handleChange} />
          </FormField>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-header">
          <h3 className="admin-card-title">Social Links</h3>
        </div>
        <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Instagram URL">
            <input type="url" className="admin-input" name="instagram" value={formData.instagram || ''} onChange={handleChange} />
          </FormField>
          <FormField label="Facebook URL">
            <input type="url" className="admin-input" name="facebook" value={formData.facebook || ''} onChange={handleChange} />
          </FormField>
          <FormField label="YouTube URL">
            <input type="url" className="admin-input" name="youtube" value={formData.youtube || ''} onChange={handleChange} />
          </FormField>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Branding</h3>
        </div>
        <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Logo Text">
            <input type="text" className="admin-input" name="logoText" value={formData.logoText || ''} onChange={handleChange} />
          </FormField>
          <FormField label="Logo Image">
            <ImageUploader 
              value={formData.logo || ''} 
              folder="site"
              onChange={(url) => setFormData(prev => ({ ...prev, logo: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, logo: '' }))}
            />
          </FormField>
        </div>
      </div>
      <div className="admin-card" style={{ marginTop: '2rem' }}>
        <div className="admin-card-header"><h3 className="admin-card-title">Search and business profile</h3></div>
        <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Website URL"><input type="url" className="admin-input" name="website" value={formData.website || ''} onChange={handleChange} /></FormField>
          <FormField label="Google Business Profile URL"><input type="url" className="admin-input" name="googleBusinessProfile" value={formData.googleBusinessProfile || ''} onChange={handleChange} /></FormField>
          <FormField label="Google Maps embed URL"><input type="url" className="admin-input" name="googleMapsUrl" value={formData.googleMapsUrl || ''} onChange={handleChange} /></FormField>
          <FormField label="Opening hours"><input className="admin-input" name="openingHours" value={formData.openingHours || ''} onChange={handleChange} /></FormField>
          <FormField label="Service area"><input className="admin-input" name="serviceArea" value={formData.serviceArea || ''} onChange={handleChange} /></FormField>
        </div>
      </div>
      </form>
    </div>
  );
}
