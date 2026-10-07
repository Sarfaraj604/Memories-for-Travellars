import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminGetReview, adminCreateReview, adminUpdateReview } from '../api/reviews';
import FormField from './components/FormField';
import ImageUploader from './components/ImageUploader';
import { useToast } from './components/Toast';

export default function ReviewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '', review: '', rating: 5, date: '', published: true, order: 0, userImage: ''
  });

  useEffect(() => {
    if (isEdit) {
      const fetchReview = async () => {
        setLoading(true);
        try {
          const data = await adminGetReview(id);
          setFormData(data);
        } catch (err) {
          toast.error('Failed to load review');
          navigate('/admin/reviews');
        } finally {
          setLoading(false);
        }
      };
      fetchReview();
    }
  }, [id, isEdit, navigate, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateReview(id, formData);
        toast.success('Review updated successfully');
      } else {
        await adminCreateReview(formData);
        toast.success('Review created successfully');
      }
      navigate('/admin/reviews');
    } catch (err) {
      toast.error(err.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>{isEdit ? 'Edit Review' : 'Add New Review'}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => navigate('/admin/reviews')}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save Review'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Reviewer Name">
            <input type="text" className="admin-input" name="name" value={formData.name} onChange={handleChange} required />
          </FormField>
          
          <FormField label="Date (e.g. 'June 2026')">
            <input type="text" className="admin-input" name="date" value={formData.date} onChange={handleChange} />
          </FormField>

          <FormField label="Rating (1-5)">
            <input type="number" min="1" max="5" className="admin-input" name="rating" value={formData.rating} onChange={handleChange} required />
          </FormField>

          <FormField label="Display Order">
            <input type="number" className="admin-input" name="order" value={formData.order} onChange={handleChange} />
          </FormField>

          <FormField label="Review Content" className="col-span-2">
            <textarea className="admin-textarea" name="review" value={formData.review} onChange={handleChange} required />
          </FormField>

          <FormField label="Reviewer Image (Optional)">
            <ImageUploader 
              value={formData.userImage} 
              folder="reviews"
              onChange={(url) => setFormData(prev => ({ ...prev, userImage: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, userImage: '' }))}
            />
          </FormField>

          <FormField label="Published Status">
            <label className="admin-toggle">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} />
              <span className="admin-toggle-slider"></span>
            </label>
          </FormField>
        </div>
      </div>
    </div>
  );
}
