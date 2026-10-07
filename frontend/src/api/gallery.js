import { api } from './client';

export const fetchGallery = () => api.get('/api/public/gallery');

export const adminListGallery = () => api.get('/api/admin/gallery');
export const adminGetGalleryItem = (id) => api.get(`/api/admin/gallery/${id}`);
export const adminCreateGalleryItem = (data) => api.post('/api/admin/gallery', data);
export const adminUpdateGalleryItem = (id, data) => api.put(`/api/admin/gallery/${id}`, data);
export const adminDeleteGalleryItem = (id) => api.del(`/api/admin/gallery/${id}`);
