import Destination from '../models/Destination.js';
import { generateSlug, ensureUniqueSlug } from '../utils/slugify.js';

export const listDestinations = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const destinations = await Destination.find(query).sort({ order: 1 });
    res.json(destinations);
  } catch (error) {
    next(error);
  }
};

export const getDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destination not found' });
    res.json(dest);
  } catch (error) {
    next(error);
  }
};

export const createDestination = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    if (!data.slug && data.name) {
      const baseSlug = generateSlug(data.name);
      data.slug = await ensureUniqueSlug(Destination, baseSlug);
    }

    if (typeof data.order === 'undefined') {
      const lastDest = await Destination.findOne().sort({ order: -1 });
      data.order = lastDest && typeof lastDest.order === 'number' ? lastDest.order + 1 : 1;
    }

    const dest = await Destination.create(data);
    res.status(201).json(dest);
  } catch (error) {
    next(error);
  }
};

export const updateDestination = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const existing = await Destination.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Destination not found' });

    if (data.slug && data.slug !== existing.slug) {
      data.slug = await ensureUniqueSlug(Destination, data.slug, req.params.id);
    } else if (!data.slug && data.name && data.name !== existing.name) {
       const baseSlug = generateSlug(data.name);
       data.slug = await ensureUniqueSlug(Destination, baseSlug, req.params.id);
    }

    const dest = await Destination.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true });
    res.json(dest);
  } catch (error) {
    next(error);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findByIdAndDelete(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Destination not found' });
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  listDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination
};
