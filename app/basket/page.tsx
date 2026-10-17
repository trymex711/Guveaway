import { Basket } from '@/components/basket';
import { publishedListings } from '@/lib/listings';
export const dynamic = 'force-dynamic';
export default async function BasketPage() { const catalogue = await publishedListings(); return <section className="shell basket-page"><span className="eyebrow">YOUR SELECTION</span><h1>Your demo basket.</h1><Basket catalogue={catalogue}/></section>; }