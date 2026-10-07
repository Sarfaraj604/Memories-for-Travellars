import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetRoom, adminCreateRoom, adminUpdateRoom } from '../api/rooms';
import FormField from './components/FormField';
import ImageUploader from './components/ImageUploader';
import { useToast } from './components/Toast';
import { Plus, Trash2 } from 'lucide-react';

const generateSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function RoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', price: '',
    maxGuests: 2, bedType: '', amenities: [], image: '', gallery: [],
    seoTitle: '', metaDescription: '', active: true, order: 0
  });

  useEffect(() => {
    if (isEdit) {
      const fetchRoom = async () => {
        setLoading(true);
        try {
          const data = await adminGetRoom(id);
          setFormData(data);
        } catch (err) {
          toast.error('Failed to load room');
          navigate('/admin/rooms');
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
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

  const handleAmenitiesChange = (e) => {
    setFormData(prev => ({ ...prev, amenities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  const addGalleryImage = () => {
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ''] }));
  };

  const updateGalleryImage = (index, value) => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      newGallery[index] = value;
      return { ...prev, gallery: newGallery };
    });
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateRoom(id, formData);
        toast.success('Room updated successfully');
      } else {
        await adminCreateRoom(formData);
        toast.success('Room created successfully');
        navigate('/admin/rooms');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save room');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{isEdit ? 'Edit Room' : 'Add New Room'}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/rooms')}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Room'}
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        {['basic', 'media', 'seo'].map(tab => (
          <button 
            key={tab} 
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-body">
          {activeTab === 'basic' && (
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Room Name">
                <input type="text" className="admin-input" name="name" value={formData.name} onChange={handleChange} required />
              </FormField>
              <FormField label="Slug">
                <input type="text" className="admin-input" name="slug" value={formData.slug} onChange={handleChange} required />
              </FormField>
              <FormField label="Price">
                <input type="text" className="admin-input" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. Rs 2,500/night" />
              </FormField>
              <FormField label="Max Guests">
                <input type="number" className="admin-input" name="maxGuests" value={formData.maxGuests} onChange={handleChange} />
              </FormField>
              <FormField label="Bed Type">
                <input type="text" className="admin-input" name="bedType" value={formData.bedType} onChange={handleChange} placeholder="e.g. King Size" />
              </FormField>
              <FormField label="Amenities (comma separated)">
                <input type="text" className="admin-input" value={formData.amenities?.join(', ') || ''} onChange={handleAmenitiesChange} />
              </FormField>
              <FormField label="Description" className="col-span-2">
                <textarea className="admin-textarea" name="description" value={formData.description} onChange={handleChange} />
              </FormField>
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
          )}

          {activeTab === 'media' && (
            <div>
              <FormField label="Main Image">
                <ImageUploader 
                  value={formData.image} 
                  folder="rooms"
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                />
              </FormField>

              <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="admin-label">Gallery Images</label>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={addGalleryImage}>
                    <Plus size={16} /> Add Image
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                  {formData.gallery?.map((img, i) => (
                    <div key={i} style={{ border: '1px solid var(--gray-200)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                      <ImageUploader 
                        value={typeof img === 'string' ? img : img?.url || ''}
                        folder="rooms"
                        onChange={(url) => updateGalleryImage(i, url)}
                        onRemove={() => updateGalleryImage(i, '')}
                      />
                      <button type="button" className="admin-btn admin-btn-danger" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => removeGalleryImage(i)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <FormField label="SEO Title">
                <input type="text" className="admin-input" name="seoTitle" value={formData.seoTitle} onChange={handleChange} />
              </FormField>
              <FormField label="Meta Description">
                <textarea className="admin-textarea" name="metaDescription" value={formData.metaDescription} onChange={handleChange} />
              </FormField>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
