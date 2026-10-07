import React, { useCallback, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { api } from '../../api/client';
import { useToast } from './Toast';

export default function ImageUploader({ value, onChange, onRemove, folder = 'general' }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const toast = useToast();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const res = await api.upload('/api/admin/upload', formData);
      if (res && res.url) {
        onChange(res.url, res.publicId);
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error(err.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  if (value) {
    return (
      <div className="admin-uploader-preview">
        <img src={value} alt="Preview" />
        <button 
          type="button"
          className="admin-uploader-remove" 
          onClick={onRemove}
          title="Remove image"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`admin-uploader-zone ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-upload-${folder}`).click()}
    >
      <input 
        id={`file-upload-${folder}`}
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleChange}
      />
      {uploading ? (
        <div style={{ color: 'var(--gray-600)' }}>Uploading...</div>
      ) : (
        <div style={{ color: 'var(--gray-500)' }}>
          <UploadCloud size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--accent)' }} />
          <div>Click or drag image to upload (JPEG, PNG, WEBP or GIF; max 5MB)</div>
        </div>
      )}
    </div>
  );
}
