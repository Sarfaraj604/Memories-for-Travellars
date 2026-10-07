import { z } from 'zod';

const optionalNumber = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.coerce.number().optional()
);

export const createGallerySchema = z.object({
  src: z.string().min(1, 'Source image is required'),
  title: z.string().optional(),
  category: z.string().optional(),
  alt: z.string().optional(),
  active: z.boolean().optional(),
  order: optionalNumber,
  cloudinaryPublicId: z.string().optional(),
});

export const updateGallerySchema = z.object({
  src: z.string().optional(),
  title: z.string().optional(),
  category: z.string().optional(),
  alt: z.string().optional(),
  active: z.boolean().optional(),
  order: optionalNumber,
  cloudinaryPublicId: z.string().optional(),
});
