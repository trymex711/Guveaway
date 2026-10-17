import { db } from './db';
import { giveaways, type Giveaway } from './giveaways';
import type { AdminListing } from '@prisma/client';

export function publicListing(item: AdminListing): Giveaway {
  return { slug: item.slug, title: item.title, category: item.category as Giveaway['category'], description: item.description, caption: item.caption, price: item.price, value: item.value, capacity: item.capacity, max: item.max, sold: 0, art: item.category === 'Houses' ? 'residence' : 'car', color: 'stone', imageUrl: item.imageUrl, imageAlt: item.imageAlt };
}

export async function publishedListings() {
  if (!process.env.DATABASE_URL) return giveaways;
  const items = await db.adminListing.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'asc' } });
  return items.map(publicListing);
}

export async function publishedListing(slug: string) {
  if (!process.env.DATABASE_URL) return giveaways.find(item => item.slug === slug);
  const item = await db.adminListing.findFirst({ where: { slug, status: 'PUBLISHED' } });
  return item ? publicListing(item) : undefined;
}
