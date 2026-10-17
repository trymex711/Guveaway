export type Giveaway = {
  slug: string; title: string; category: 'Houses' | 'Cars'; description: string;
  price: number; value: number; sold: number; capacity: number; max: number;
  art: string; color: string; caption: string;
};

export const giveaways: Giveaway[] = [
  { slug: 'the-modern-residence', title: 'The Modern Residence', category: 'Houses',
    description: 'Space to live differently. A contemporary four-bedroom home with open-plan interiors, landscaped gardens, and room to make your own. An illustrative house prize for this platform preview; no property is currently being awarded.',
    price: 1000, value: 125000000, sold: 18600, capacity: 50000, max: 20,
    art: 'residence', color: 'stone', caption: 'Four bedrooms. A new perspective.' },
  { slug: 'the-grand-tourer', title: 'The Grand Tourer', category: 'Cars',
    description: 'For the love of the drive. A performance coupe with sculpted lines, a considered interior, and a road ahead full of possibility. An illustrative car prize for this platform preview; no vehicle is currently being awarded.',
    price: 500, value: 9500000, sold: 4200, capacity: 15000, max: 20,
    art: 'car', color: 'stone', caption: 'Exceptional design. Open-road freedom.' },
];

export function money(pence: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: pence % 100 ? 2 : 0 }).format(pence / 100);
}