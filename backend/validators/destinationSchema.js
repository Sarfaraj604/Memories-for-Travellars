import { z } from 'zod';

const optionalNumber = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.coerce.number().optional()
);

export const destinationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  active: z.boolean().optional(),
  order: optionalNumber,
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});
