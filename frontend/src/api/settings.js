import { api } from './client';

export const fetchSettings = () => api.get('/api/public/settings');

export const adminGetSettings = () => api.get('/api/admin/settings');
export const adminUpdateSettings = (data) => api.put('/api/admin/settings', data);
