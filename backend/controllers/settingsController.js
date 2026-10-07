import Settings from '../models/Settings.js';
import { settingsSchema } from '../validators/settingsSchema.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne().lean() || {};
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const parsed = settingsSchema.parse(req.body);
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(parsed);
    } else {
      settings = await Settings.findOneAndUpdate({}, parsed, { returnDocument: 'after', runValidators: true });
    }
    res.json(settings);
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ errors: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) });
    next(error);
  }
};

export default {
  getSettings,
  updateSettings
};
