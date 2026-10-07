import { api } from './client';

// Public
export const submitEnquiry = (data) => api.post('/api/public/enquiries', data);

// Admin
export const adminListEnquiries = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/admin/enquiries${query ? `?${query}` : ''}`);
};
export const adminGetEnquiry = (id) => api.get(`/api/admin/enquiries/${id}`);
export const adminUpdateEnquiry = (id, data) => api.put(`/api/admin/enquiries/${id}`, data);
export const adminDeleteEnquiry = (id) => api.del(`/api/admin/enquiries/${id}`);
export const adminExportEnquiries = () => api.get('/api/admin/enquiries/export');
