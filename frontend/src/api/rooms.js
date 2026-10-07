import { api } from './client';

export const fetchRooms = () => api.get('/api/public/rooms');

export const adminListRooms = () => api.get('/api/admin/rooms');
export const adminGetRoom = (id) => api.get(`/api/admin/rooms/${id}`);
export const adminCreateRoom = (data) => api.post('/api/admin/rooms', data);
export const adminUpdateRoom = (id, data) => api.put(`/api/admin/rooms/${id}`, data);
export const adminDeleteRoom = (id) => api.del(`/api/admin/rooms/${id}`);
