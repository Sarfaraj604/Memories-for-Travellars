import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetDestination, adminCreateDestination, adminUpdateDestination } from '../api/destinations';
import FormField from './components/FormField';
import ImageUploader from './components/ImageUploader';
import { useToast } from './components/Toast';

const generateSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', image: '',
    seoTitle: '', metaDescription: '', active: true, order: 0
  });

  useEffect(() => {
    if (isEdit) {
      const fetchDest = async () => {
        setLoading(true);
        try {
          const data = await adminGetDestination(id);
          setFormData(data);
        } catch (err) {
          toast.error('Failed to load destination');
          navigate('/admin/destinations');
        } finally {
          setLoading(false);
        }
      };
      fetchDest();
    }
  }, [id, isEdit, navigate, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name' && !isEdit && !prev.slug) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateDestination(id, formData);
        toast.success('Destination updated successfully');
      } else {
        await adminCreateDestination(formData);
        toast.success('Destination created successfully');
        navigate('/admin/destinations');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{isEdit ? 'Edit Destination' : 'Add New Destination'}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/destinations')}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Destination'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Name">
            <input type="text" className="admin-input" name="name" value={formData.name} onChange={handleChange} required />
          </FormField>
          
          <FormField label="Slug">
            <input type="text" className="admin-input" name="slug" value={formData.slug} onChange={handleChange} required />
          </FormField>

          <FormField label="Description" className="col-span-2">
            <textarea className="admin-textarea" name="description" value={formData.description} onChange={handleChange} />
          </FormField>

          <FormField label="Image">
            <ImageUploader 
              value={formData.image} 
              folder="destinations"
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
            />
          </FormField>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FormField label="Active Status">
              <label className="admin-toggle">
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                <span className="admin-toggle-slider"></span>
              </label>
            </FormField>

            <FormField label="Display Order">
              <input type="number" className="admin-input" name="order" value={formData.order} onChange={handleChange} />
            </FormField>
          </div>

          <FormField label="SEO Title">
            <input type="text" className="admin-input" name="seoTitle" value={formData.seoTitle} onChange={handleChange} />
          </FormField>

          <FormField label="Meta Description">
            <textarea className="admin-textarea" name="metaDescription" value={formData.metaDescription} onChange={handleChange} style={{ minHeight: '80px' }} />
          </FormField>
        </div>
      </div>
    </div>
  );
}
