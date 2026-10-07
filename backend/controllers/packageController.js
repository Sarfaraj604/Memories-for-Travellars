import Package from '../models/Package.js';
import { generateSlug, ensureUniqueSlug } from '../utils/slugify.js';

export const listPackages = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } }
      ];
    }
    const packages = await Package.find(query).sort({ order: 1 });
    res.json(packages);
  } catch (error) {
    next(error);
  }
};

export const getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (error) {
    next(error);
  }
};

export const createPackage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    // Auto-generate slug
    if (!data.slug && data.name) {
      const baseSlug = generateSlug(data.name);
      data.slug = await ensureUniqueSlug(Package, baseSlug);
    }

    // Set order to max + 1
    if (typeof data.order === 'undefined') {
      const lastPkg = await Package.findOne().sort({ order: -1 });
      data.order = lastPkg && typeof lastPkg.order === 'number' ? lastPkg.order + 1 : 1;
    }

    const pkg = await Package.create(data);
    res.status(201).json(pkg);
  } catch (error) {
    next(error);
  }
};

export const updatePackage = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const existing = await Package.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Package not found' });

    if (data.slug && data.slug !== existing.slug) {
      data.slug = await ensureUniqueSlug(Package, data.slug, req.params.id);
    } else if (!data.slug && data.name && data.name !== existing.name) {
       const baseSlug = generateSlug(data.name);
       data.slug = await ensureUniqueSlug(Package, baseSlug, req.params.id);
    }

    const pkg = await Package.findByIdAndUpdate(req.params.id, data, { returnDocument: 'after', runValidators: true });
    res.json(pkg);
  } catch (error) {
    next(error);
  }
};

export const deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export default {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
};
