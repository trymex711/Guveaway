import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = { title: 'Extraordinary Draws — Exceptional homes. Iconic cars.', description: 'Discover a considered collection of house and car giveaways. Demo experience.' };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <div className="banner">A preview of the extraordinary. Demo only — no real entries or payments.</div>
    <header className="shell site-header">
      <Link className="brand" href="/" aria-label="Extraordinary Draws home"><span className="brand-mark" aria-hidden="true">e.</span><span>EXTRAORDINARY<small>D R A W S</small></span></Link>
      <nav aria-label="Main navigation"><Link href="/#giveaways">The collection</Link><Link href="/#how-it-works">How it works</Link><Link className="basket-link" href="/basket">Basket <span aria-hidden="true">↗</span></Link></nav>
    </header>
    <main>{children}</main>
    <footer className="shell"><div className="footer-brand">Extraordinary Draws.<p>Exceptional homes. Iconic cars.</p></div><p>18+ · Demo experience · Illustrative prizes<br/>Photography represents the concept, not an actual prize.</p><Link href="/#giveaways">Explore the collection ↗</Link></footer>
  </body></html>;
}