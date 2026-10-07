import { api } from './client';

// Public
export const fetchPackages = () => api.get('/api/public/packages');
export const fetchPackageBySlug = (slug) => api.get(`/api/public/packages/${slug}`);

// Admin
export const adminListPackages = () => api.get('/api/admin/packages');
export const adminGetPackage = (id) => api.get(`/api/admin/packages/${id}`);
export const adminCreatePackage = (data) => api.post('/api/admin/packages', data);
export const adminUpdatePackage = (id, data) => api.put(`/api/admin/packages/${id}`, data);
export const adminDeletePackage = (id) => api.del(`/api/admin/packages/${id}`);
