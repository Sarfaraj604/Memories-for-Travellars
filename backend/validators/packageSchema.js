import { z } from 'zod';

const optionalNumber = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.coerce.number().optional()
);

export const packageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  destination: z.string().min(1, 'Destination is required'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  priceValue: z.preprocess(
    (value) => value === '' ? null : value,
    z.coerce.number().nullable().optional()
  ),
  priceLabel: z.string().optional(),
  durationDays: optionalNumber,
  nights: optionalNumber,
  guests: z.union([z.string(), z.coerce.number().transform(String)]).optional(),
  tripType: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  itinerary: z.array(
    z.object({
      day: z.coerce.number(),
      title: z.string(),
      description: z.string(),
      places: z.array(z.string()).optional(),
      meals: z.string().optional(),
      accommodation: z.string().optional(),
    })
  ).optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  accommodation: z.string().optional(),
  transportation: z.string().optional(),
  importantInfo: z.array(z.string()).optional(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ).optional(),
  image: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  order: optionalNumber,
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
});
