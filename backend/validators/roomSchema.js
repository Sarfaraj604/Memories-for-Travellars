import { z } from 'zod';

const optionalNumber = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.coerce.number().optional()
);

export const roomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  priceValue: optionalNumber,
  maxGuests: z.union([z.string(), z.coerce.number().transform(String)]).optional(),
  bedType: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  image: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  order: optionalNumber,
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});
