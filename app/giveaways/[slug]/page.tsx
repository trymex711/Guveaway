import Link from 'next/link';
import { notFound } from 'next/navigation';
import { giveaways, money } from '@/lib/giveaways';
import { Art } from '@/components/art';
import { TicketPicker } from '@/components/ticket-picker';

export function generateStaticParams() { return giveaways.map(({ slug }) => ({ slug })); }

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = giveaways.find(g => g.slug === slug);
  if (!g) notFound();
  return <section className="shell detail">
    <Link className="text-link" href="/#giveaways">← The collection</Link>
    <div className="detail-grid"><div className="detail-art"><Art kind={g.art} priority /><span className="tag">{g.category}</span><span className="image-note">Illustrative photography</span></div><div className="detail-copy"><span className="eyebrow">{g.category === 'Houses' ? 'THE RESIDENCE' : 'THE MOTOR COLLECTION'} · DEMO PRIZE</span><h1>{g.title}</h1><p>{g.description}</p><div className="detail-stats"><div><small>Prize value</small><strong>{money(g.value)}</strong></div><div><small>Per demo entry</small><strong>{money(g.price)}</strong></div></div><TicketPicker slug={g.slug} price={g.price} max={g.max} /></div></div>
    <details className="rules"><summary>About this preview <span aria-hidden="true">+</span></summary><p>Prizes, photography, and values are illustrative. Basket selections are saved only in your browser. There is no active giveaway, closing date, checkout, or winner selection in this demo.</p><p>A real launch requires published terms, eligibility checks, confirmed prize availability, payment integration, and an auditable draw process.</p></details>
  </section>;
}