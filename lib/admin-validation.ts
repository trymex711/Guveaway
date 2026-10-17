import { z } from 'zod';

export const listingSchema = z.object({
  slug: z.string().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.'),
  title: z.string().trim().min(3).max(100),
  category: z.enum(['Houses', 'Cars']),
  description: z.string().trim().min(20).max(4000),
  caption: z.string().trim().min(3).max(160),
  price: z.number().int().min(1).max(100000),
  value: z.number().int().min(100).max(2000000000),
  capacity: z.number().int().min(1).max(10000000),
  max: z.number().int().min(1).max(1000),
  imageUrl: z.string().max(2000).refine(value => {
    if (['/images/residence.jpg', '/images/grand-tourer.jpg'].includes(value)) return true;
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
  }, 'Choose a supplied photo or an HTTPS image URL.'),
  imageAlt: z.string().trim().min(5).max(240),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  revision: z.number().int().min(1).optional(),
}).refine(data => data.max <= data.capacity, { path: ['max'], message: 'Per-person limit cannot exceed total capacity.' });

export const setupSchema = z.object({ token: z.string().min(40).max(128), name: z.string().trim().min(2).max(100), password: z.string().min(12).max(128) });
