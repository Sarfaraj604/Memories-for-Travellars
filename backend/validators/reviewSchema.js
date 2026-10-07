import { z } from 'zod';

export const reviewSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rating: z.union([z.coerce.number(), z.string()]),
  review: z.string().optional(),
  date: z.string().optional(),
  published: z.boolean().optional(),
  order: z.preprocess(
    (value) => value === '' || value === null ? undefined : value,
    z.coerce.number().optional()
  ),
});
