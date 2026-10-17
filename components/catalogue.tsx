'use client';

import { useState } from 'react';
import Link from 'next/link';
import { giveaways, money } from '@/lib/giveaways';
import { Art } from './art';

export function Catalogue() {
  const [category, setCategory] = useState('All');
  const visible = giveaways.filter(g => category === 'All' || g.category === category);
  return <section className="shell catalogue" id="giveaways">
    <div className="section-heading"><div><span className="eyebrow">THE COLLECTION</span><h2>Extraordinary by nature.</h2></div><div className="filters" role="group" aria-label="Prize categories">{['All', 'Houses', 'Cars'].map(c => <button key={c} aria-pressed={category === c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
    <span className="sr-only" role="status">{visible.length} demo prizes</span>
    <div className="prize-grid">{visible.map(g => <article className="prize-card" key={g.slug}>
      <Link href={'/giveaways/' + g.slug} className="card-art" aria-label={'Discover ' + g.title}><Art kind={g.art} /><span className="tag">{g.category === 'Houses' ? 'THE RESIDENCE' : 'THE MOTOR COLLECTION'}</span><span className="image-note">Illustrative photography</span></Link>
      <div className="card-copy"><div className="card-kicker"><span>{g.category === 'Houses' ? 'A NEW WAY OF LIVING' : 'MADE FOR THE JOURNEY'}</span><span>{g.category === 'Houses' ? '01' : '02'}</span></div><div className="card-title"><h3><Link href={'/giveaways/' + g.slug}>{g.title}</Link></h3><span>{money(g.price)}<small>per demo entry</small></span></div><p>{g.caption}</p><div className="card-meta"><span>Prize value <strong>{money(g.value)}</strong></span><Link href={'/giveaways/' + g.slug}>View prize <span aria-hidden="true">↗</span></Link></div></div>
    </article>)}</div>
  </section>;
}