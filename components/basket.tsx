'use client';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import {BASKET_KEY,parseBasket,type BasketItem} from '@/lib/basket';
import {giveaways,money} from '@/lib/giveaways';
export function Basket(){const [items,setItems]=useState<BasketItem[]>([]);const [ready,setReady]=useState(false);const [error,setError]=useState('');useEffect(()=>{try{setItems(parseBasket(localStorage.getItem(BASKET_KEY)));}catch{setError('Your browser could not load the saved basket.');}setReady(true);},[]);
 function remove(slug:string){const next=items.filter(i=>i.slug!==slug);try{localStorage.setItem(BASKET_KEY,JSON.stringify(next));setItems(next);setError('');}catch{setError('Your browser could not save the basket.');}}
 const total=items.reduce((sum,i)=>sum+(giveaways.find(g=>g.slug===i.slug)?.price??0)*i.quantity,0);
 if(!ready)return <p role="status">Loading your basket…</p>;
 return <><p role="status">{error}</p>{items.length?<div className="basket-layout"><div>{items.map(i=>{const g=giveaways.find(g=>g.slug===i.slug)!;return <article className="basket-item" key={i.slug}><div><span className="eyebrow">{g.category}</span><h2><Link href={'/giveaways/'+i.slug}>{g.title}</Link></h2><p>{i.quantity} demo entries × {money(g.price)}</p><button className="remove" onClick={()=>remove(i.slug)} aria-label={'Remove '+g.title}>Remove</button></div><strong>{money(g.price*i.quantity)}</strong></article>;})}</div><aside className="basket-summary"><h2>Your selection.</h2><div className="summary-total"><span>Demo total</span><strong>{money(total)}</strong></div><p>Checkout is not available. No payment will be taken, and these selections do not reserve or issue tickets.</p><Link className="button full" href="/#giveaways">Keep exploring ↗</Link></aside></div>:<div className="empty"><h2>Your collection starts here.</h2><p>You haven’t added any demo entries yet.</p><Link className="button" href="/#giveaways">Explore the collection ↗</Link></div>}</>
}