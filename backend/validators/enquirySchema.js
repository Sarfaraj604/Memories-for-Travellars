import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(5, 'Phone must be at least 5 characters'),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  destination: z.string().optional(),
  tourPackage: z.string().optional(),
  date: z.string().optional(),
  guests: z.string().optional(),
  nights: z.string().optional(),
  tripType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export const enquiryUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'closed']).optional(),
  notes: z.string().max(5000, 'Notes must be 5000 characters or fewer').optional(),
}).strict();
