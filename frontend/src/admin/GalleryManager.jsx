import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { adminListGallery, adminCreateGalleryItem, adminUpdateGalleryItem, adminDeleteGalleryItem } from '../api/gallery';
import LoadingState from './components/LoadingState';
import ConfirmDialog from './components/ConfirmDialog';
import FormField from './components/FormField';
import ImageUploader from './components/ImageUploader';
import { useToast } from './components/Toast';

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'General', alt: '', src: '', cloudinaryPublicId: '', order: 0 });
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await adminListGallery();
      setItems(data);
    } catch (err) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteGalleryItem(deleteId);
      toast.success('Image deleted');
      setItems(items.filter(i => i._id !== deleteId));
    } catch (err) {
      toast.error('Failed to delete image');
    } finally {
      setDeleteId(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.src) {
      toast.error('Please upload an image');
      return;
    }
    try {
      if (editingId) {
        const updated = await adminUpdateGalleryItem(editingId, formData);
        setItems(items.map(i => i._id === editingId ? updated : i));
        toast.success('Updated successfully');
      } else {
        const created = await adminCreateGalleryItem(formData);
        setItems([...items, created]);
        toast.success('Added to gallery');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save');
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title || '',
        category: item.category || 'General',
        alt: item.alt || '',
        src: item.src || '',
        cloudinaryPublicId: item.cloudinaryPublicId || '',
        order: item.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', category: 'General', alt: '', src: '', cloudinaryPublicId: '', order: 0 });
    }
    setModalOpen(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Gallery Manager</h2>
        <button className="admin-btn admin-btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> Add Image
        </button>
      </div>

      {loading ? (
        <LoadingState type="cards" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {items.map(item => (
            <div key={item._id} className="admin-card">
              <div style={{ width: '100%', paddingTop: '75%', position: 'relative', overflow: 'hidden' }}>
                <img src={item.src} alt={item.alt || item.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="admin-card-body" style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{item.title || 'Untitled'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>Category: {item.category}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button className="admin-btn-icon" onClick={() => openModal(item)}><Edit size={16} /></button>
                  <button className="admin-btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(item._id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 className="admin-modal-title">{editingId ? 'Edit Image' : 'Add Image'}</h3>
              <button className="admin-btn-icon" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-modal-body">
                <FormField label="Image">
                  <ImageUploader 
                    value={formData.src} 
                    folder="gallery"
                    onChange={(url, publicId) => setFormData(prev => ({ ...prev, src: url, cloudinaryPublicId: publicId }))}
                    onRemove={() => setFormData(prev => ({ ...prev, src: '', cloudinaryPublicId: '' }))}
                  />
                </FormField>
                <FormField label="Title">
                  <input type="text" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </FormField>
                <FormField label="Category">
                  <input type="text" className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </FormField>
                <FormField label="Alt Text (SEO)">
                  <input type="text" className="admin-input" value={formData.alt} onChange={e => setFormData({...formData, alt: e.target.value})} />
                </FormField>
                <FormField label="Order">
                  <input type="number" className="admin-input" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
                </FormField>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog 
        open={!!deleteId}
        title="Delete Image"
        message="Are you sure you want to remove this image from the gallery?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
