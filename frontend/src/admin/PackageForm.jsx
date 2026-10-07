import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetPackage, adminCreatePackage, adminUpdatePackage } from '../api/packages';
import FormField from './components/FormField';
import ImageUploader from './components/ImageUploader';
import { useToast } from './components/Toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';

// A helper to generate slug from string
const generateSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function PackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '', slug: '', destination: '', shortDescription: '', description: '',
    price: '', durationDays: 1, nights: 0, guests: 2, tripType: [], tags: [],
    image: '', gallery: [],
    itinerary: [], inclusions: [], exclusions: [],
    accommodation: '', transportation: '', importantInfo: [], faqs: [],
    seoTitle: '', metaDescription: '', featured: false, active: true, order: 0
  });

  useEffect(() => {
    if (isEdit) {
      const fetchPackage = async () => {
        setLoading(true);
        try {
          const data = await adminGetPackage(id);
          setFormData(data);
        } catch (err) {
          toast.error('Failed to load package details');
          navigate('/admin/packages');
        } finally {
          setLoading(false);
        }
      };
      fetchPackage();
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

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], defaultValue] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  // String lists that are comma-separated for simple inputs
  const handleStringList = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdatePackage(id, formData);
        toast.success('Package updated successfully');
      } else {
        await adminCreatePackage(formData);
        toast.success('Package created successfully');
        navigate('/admin/packages');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{isEdit ? 'Edit Package' : 'Add New Package'}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/packages')}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Package'}
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        {['basic', 'details', 'media', 'itinerary', 'inclusions', 'additional', 'seo'].map(tab => (
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
              <FormField label="Package Name" className="col-span-2">
                <input type="text" className="admin-input" name="name" value={formData.name} onChange={handleChange} required />
              </FormField>
              <FormField label="Slug">
                <input type="text" className="admin-input" name="slug" value={formData.slug} onChange={handleChange} required />
              </FormField>
              <FormField label="Destination">
                <input type="text" className="admin-input" name="destination" value={formData.destination} onChange={handleChange} />
              </FormField>
              <FormField label="Short Description (for cards)" className="col-span-2">
                <textarea className="admin-textarea" style={{ minHeight: '80px' }} name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
              </FormField>
              <FormField label="Full Description" className="col-span-2">
                <textarea className="admin-textarea" name="description" value={formData.description} onChange={handleChange} />
              </FormField>
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
              <FormField label="Price">
                <input type="text" className="admin-input" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. Rs 15,000 per person" />
              </FormField>
              <FormField label="Guests">
                <input type="number" className="admin-input" name="guests" value={formData.guests} onChange={handleChange} />
              </FormField>
              <FormField label="Duration (Days)">
                <input type="number" className="admin-input" name="durationDays" value={formData.durationDays} onChange={handleChange} />
              </FormField>
              <FormField label="Duration (Nights)">
                <input type="number" className="admin-input" name="nights" value={formData.nights} onChange={handleChange} />
              </FormField>
              <FormField label="Trip Type (comma separated)">
                <input type="text" className="admin-input" value={formData.tripType?.join(', ') || ''} onChange={e => handleStringList('tripType', e.target.value)} placeholder="Adventure, Honeymoon" />
              </FormField>
              <FormField label="Tags (comma separated)">
                <input type="text" className="admin-input" value={formData.tags?.join(', ') || ''} onChange={e => handleStringList('tags', e.target.value)} />
              </FormField>
              <FormField label="Featured">
                <label className="admin-toggle">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                  <span className="admin-toggle-slider"></span>
                </label>
              </FormField>
              <FormField label="Active Status">
                <label className="admin-toggle">
                  <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                  <span className="admin-toggle-slider"></span>
                </label>
              </FormField>
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <FormField label="Main Image">
                <ImageUploader 
                  value={formData.image} 
                  folder="packages"
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                />
              </FormField>
              
              <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="admin-label">Gallery Images</label>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('gallery', '')}>
                    <Plus size={16} /> Add Image
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                  {formData.gallery?.map((img, i) => (
                    <div key={i} style={{ border: '1px solid var(--gray-200)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                      <ImageUploader 
                        value={typeof img === 'string' ? img : img?.url || ''}
                        folder="packages"
                        onChange={(url) => {
                          const newGal = [...formData.gallery];
                          newGal[i] = url;
                          setFormData(prev => ({ ...prev, gallery: newGal }));
                        }}
                        onRemove={() => {
                          const newGal = [...formData.gallery];
                          newGal[i] = '';
                          setFormData(prev => ({ ...prev, gallery: newGal }));
                        }}
                      />
                      <button type="button" className="admin-btn admin-btn-danger" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => removeArrayItem('gallery', i)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('itinerary', { day: formData.itinerary.length + 1, title: '', description: '', places: '', meals: '', accommodation: '' })}>
                  <Plus size={16} /> Add Day
                </button>
              </div>
              {formData.itinerary?.map((day, i) => (
                <div key={i} style={{ border: '1px solid var(--gray-200)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4>Day {day.day}</h4>
                    <button type="button" className="admin-btn-icon" style={{ color: 'var(--danger)' }} onClick={() => removeArrayItem('itinerary', i)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <FormField label="Day Number">
                      <input type="number" className="admin-input" value={day.day} onChange={(e) => {
                        const newIti = [...formData.itinerary];
                        newIti[i].day = Number(e.target.value);
                        setFormData(prev => ({ ...prev, itinerary: newIti }));
                      }} />
                    </FormField>
                    <FormField label="Title">
                      <input type="text" className="admin-input" value={day.title} onChange={(e) => {
                        const newIti = [...formData.itinerary];
                        newIti[i].title = e.target.value;
                        setFormData(prev => ({ ...prev, itinerary: newIti }));
                      }} />
                    </FormField>
                    <FormField label="Description" className="col-span-2">
                      <textarea className="admin-textarea" value={day.description} onChange={(e) => {
                        const newIti = [...formData.itinerary];
                        newIti[i].description = e.target.value;
                        setFormData(prev => ({ ...prev, itinerary: newIti }));
                      }} />
                    </FormField>
                    <FormField label="Places (comma separated)">
                      <input type="text" className="admin-input" value={Array.isArray(day.places) ? day.places.join(', ') : day.places} onChange={(e) => {
                        const newIti = [...formData.itinerary];
                        newIti[i].places = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setFormData(prev => ({ ...prev, itinerary: newIti }));
                      }} />
                    </FormField>
                    <FormField label="Meals">
                      <input type="text" className="admin-input" value={day.meals} onChange={(e) => {
                        const newIti = [...formData.itinerary];
                        newIti[i].meals = e.target.value;
                        setFormData(prev => ({ ...prev, itinerary: newIti }));
                      }} />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'inclusions' && (
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4>Inclusions</h4>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('inclusions', '')}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                {formData.inclusions?.map((inc, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" className="admin-input" value={inc} onChange={(e) => handleArrayChange('inclusions', i, e.target.value)} />
                    <button type="button" className="admin-btn-icon" onClick={() => removeArrayItem('inclusions', i)}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4>Exclusions</h4>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('exclusions', '')}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                {formData.exclusions?.map((exc, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" className="admin-input" value={exc} onChange={(e) => handleArrayChange('exclusions', i, e.target.value)} />
                    <button type="button" className="admin-btn-icon" onClick={() => removeArrayItem('exclusions', i)}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div>
              <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
                <FormField label="Accommodation Details">
                  <textarea className="admin-textarea" name="accommodation" value={formData.accommodation} onChange={handleChange} />
                </FormField>
                <FormField label="Transportation Details">
                  <textarea className="admin-textarea" name="transportation" value={formData.transportation} onChange={handleChange} />
                </FormField>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4>Important Information</h4>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('importantInfo', '')}>
                    <Plus size={16} /> Add
                  </button>
                </div>
                {formData.importantInfo?.map((info, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input type="text" className="admin-input" value={info} onChange={(e) => handleArrayChange('importantInfo', i, e.target.value)} />
                    <button type="button" className="admin-btn-icon" onClick={() => removeArrayItem('importantInfo', i)}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4>FAQs</h4>
                  <button type="button" className="admin-btn admin-btn-outline" onClick={() => addArrayItem('faqs', { question: '', answer: '' })}>
                    <Plus size={16} /> Add FAQ
                  </button>
                </div>
                {formData.faqs?.map((faq, i) => (
                  <div key={i} style={{ border: '1px solid var(--gray-200)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
                    <FormField label="Question">
                      <input type="text" className="admin-input" value={faq.question} onChange={(e) => {
                        const newFaqs = [...formData.faqs];
                        newFaqs[i].question = e.target.value;
                        setFormData(prev => ({ ...prev, faqs: newFaqs }));
                      }} />
                    </FormField>
                    <FormField label="Answer">
                      <textarea className="admin-textarea" style={{ minHeight: '60px' }} value={faq.answer} onChange={(e) => {
                        const newFaqs = [...formData.faqs];
                        newFaqs[i].answer = e.target.value;
                        setFormData(prev => ({ ...prev, faqs: newFaqs }));
                      }} />
                    </FormField>
                    <div style={{ textAlign: 'right' }}>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeArrayItem('faqs', i)}>Remove FAQ</button>
                    </div>
                  </div>
                ))}
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
              <FormField label="Display Order">
                <input type="number" className="admin-input" name="order" value={formData.order} onChange={handleChange} />
              </FormField>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
