import { api } from './client';

export const fetchDestinations = () => api.get('/api/public/destinations');

export const adminListDestinations = () => api.get('/api/admin/destinations');
export const adminGetDestination = (id) => api.get(`/api/admin/destinations/${id}`);
export const adminCreateDestination = (data) => api.post('/api/admin/destinations', data);
export const adminUpdateDestination = (id, data) => api.put(`/api/admin/destinations/${id}`, data);
export const adminDeleteDestination = (id) => api.del(`/api/admin/destinations/${id}`);
