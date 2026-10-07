import { api } from './client';

export const fetchSiteContent = () => api.get('/api/public/site-content');

export const adminGetSiteContent = () => api.get('/api/admin/site-content');
export const adminUpdateSiteContent = (data) => api.put('/api/admin/site-content', data);
