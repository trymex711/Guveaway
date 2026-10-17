'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
const items = [['/admin','Overview'],['/admin/listings','Prizes'],['/admin/users','Users'],['/admin/entries','Entries'],['/admin/draws','Draws'],['/admin/activity','Activity']];
export function AdminNavigation(){
  const path = usePathname(); const router=useRouter(); const [message,setMessage]=useState(''); const [pending,setPending]=useState(false);
  async function logout(){setPending(true);try{const response=await fetch('/api/auth/sign-out',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!response.ok)throw new Error();router.replace('/admin/login');router.refresh();}catch{setMessage('Could not sign out. Please try again.');setPending(false);}}
  return <><nav className="admin-nav" aria-label="Admin navigation">{items.map(([url,label])=><Link href={url} key={url} className={(url==='/admin'?path===url:path.startsWith(url))?'selected':''} aria-current={(url==='/admin'?path===url:path.startsWith(url))?'page':undefined}>{label}<span aria-hidden="true">↗</span></Link>)}</nav><button className="admin-signout" onClick={logout} disabled={pending}>{pending?'Signing out…':'Sign out'}</button><p className="fine-print" role="status">{message}</p></>;
}