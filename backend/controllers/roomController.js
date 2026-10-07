import Room from '../models/Room.js';
import { generateSlug, ensureUniqueSlug } from '../utils/slugify.js';

export const listRooms = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const rooms = await Room.find(query).sort({ order: 1 });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    if (!data.slug && data.name) {
      const baseSlug = generateSlug(data.name);
      data.slug = await ensureUniqueSlug(Room, baseSlug);
    }

    if (typeof data.order === 'undefined') {
      const lastRoom = await Room.findOne().sort({ order: -1 });
      data.order = lastRoom && typeof lastRoom.order === 'number' ? lastRoom.order + 1 : 1;
    }

    const room = await Room.create(data);
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const existing = await Room.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Room not found' });

    if (data.slug && data.slug !== existing.slug) {
      data.slug = await ensureUniqueSlug(Room, data.slug, req.params.id);
    } else if (!data.slug && data.name && data.name !== existing.name) {
       const baseSlug = generateSlug(data.name);
       data.slug = await ensureUniqueSlug(Room, baseSlug, req.params.id);
    }

    const room = await Room.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true });
    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom
};
