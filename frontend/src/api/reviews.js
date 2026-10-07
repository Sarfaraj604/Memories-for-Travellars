import { api } from './client';

export const fetchReviews = () => api.get('/api/public/reviews');

export const adminListReviews = () => api.get('/api/admin/reviews');
export const adminGetReview = (id) => api.get(`/api/admin/reviews/${id}`);
export const adminCreateReview = (data) => api.post('/api/admin/reviews', data);
export const adminUpdateReview = (id, data) => api.put(`/api/admin/reviews/${id}`, data);
export const adminDeleteReview = (id) => api.del(`/api/admin/reviews/${id}`);
