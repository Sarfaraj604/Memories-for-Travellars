import { z } from 'zod';

const optionalText = z.string().trim().max(500).optional();
export const settingsSchema = z.object({
  businessName: optionalText,
  legalName: optionalText,
  tagline: optionalText,
  phone: optionalText,
  phoneLabel: optionalText,
  whatsapp: optionalText,
  whatsappLabel: optionalText,
  email: z.union([z.string().email(), z.literal('')]).optional(),
  address: optionalText,
  website: z.union([z.string().url(), z.literal('')]).optional(),
  googleMapsUrl: z.union([z.string().url(), z.literal('')]).optional(),
  googleBusinessProfile: z.union([z.string().url(), z.literal('')]).optional(),
  instagram: z.union([z.string().url(), z.literal('')]).optional(),
  facebook: z.union([z.string().url(), z.literal('')]).optional(),
  youtube: z.union([z.string().url(), z.literal('')]).optional(),
  openingHours: optionalText,
  serviceArea: optionalText,
  logoText: optionalText,
  logo: z.union([z.string().url(), z.literal('')]).optional(),
  colors: z.object({ dark: optionalText, green: optionalText, sage: optionalText, accent: optionalText, background: optionalText }).optional(),
});
