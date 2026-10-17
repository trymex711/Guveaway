import { requireAdmin } from '@/lib/admin-access';
import Link from 'next/link';
import { db } from '@/lib/db';
import { money } from '@/lib/giveaways';
export default async function ListingsPage(){await requireAdmin();
 const items=await db.adminListing.findMany({orderBy:{createdAt:'desc'}});
 return <><div className="admin-heading"><div><span className="eyebrow">THE COLLECTION</span><h1>Exceptional prizes.</h1><p>Create, refine, and publish houses and cars.</p></div><Link className="button" href="/admin/listings/new">Add a prize +</Link></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Prize</th><th>Status</th><th>Entry price</th><th>Value</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td><strong>{item.title}</strong><small>{item.category} · /{item.slug}</small></td><td><span className={'status status-'+item.status.toLowerCase()}>{item.status.toLowerCase()}</span></td><td>{money(item.price)}</td><td>{money(item.value)}</td><td><Link className="text-link" href={'/admin/listings/'+item.id}>Edit ↗</Link></td></tr>)}</tbody></table>{!items.length?<p className="admin-empty">Your collection is ready for its first prize.</p>:null}</div></>;
}