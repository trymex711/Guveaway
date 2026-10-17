import Link from 'next/link';
import { Catalogue } from '@/components/catalogue';
import { Art } from '@/components/art';

export default function Home() {
  return <>
    <section className="hero">
      <Art kind="residence" priority />
      <div className="hero-shade" />
      <div className="shell hero-content"><span className="eyebrow">EXCEPTIONAL HOMES. ICONIC CARS.</span><h1>A life less<br/><em>ordinary.</em></h1><p>Remarkable places to call home.<br/>Extraordinary cars to call yours.</p><Link className="button light" href="#giveaways">Discover the collection <span aria-hidden="true">↗</span></Link></div>
      <div className="shell hero-bottom"><span>THE MODERN RESIDENCE</span><Link href="/giveaways/the-modern-residence">Discover the house <span aria-hidden="true">↗</span></Link></div>

    </section>
    <Catalogue />
    <section className="shell how" id="how-it-works"><div><span className="eyebrow">SIMPLY EXTRAORDINARY</span><h2>A possibility.<br/>Three simple steps.</h2></div><ol><li><span>01</span><div><h3>Find your prize</h3><p>A remarkable home or an exceptional car.</p></div></li><li><span>02</span><div><h3>Choose your entries</h3><p>Review the details. Select your demo entries.</p></div></li><li><span>03</span><div><h3>Keep the possibility</h3><p>Save your selection in your demo basket.</p></div></li></ol></section>
  </>;
}