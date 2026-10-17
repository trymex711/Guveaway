'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export function AdminSetup() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => { const key = window.location.hash.slice(1); if(key) { setToken(key); history.replaceState(null, '', window.location.pathname); } }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage('');
    const data = new FormData(event.currentTarget);
    if (data.get('password') !== data.get('confirm')) { setMessage('The passwords do not match.'); return; }
    setPending(true);
    try {
      const response = await fetch('/api/admin/setup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, name:data.get('name'), password:data.get('password') }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.message ?? 'Setup failed.'); return; }
      router.replace('/admin/login'); router.refresh();
    } catch { setMessage('Unable to connect. Please try again.'); } finally { setPending(false); }
  }
  return <form className="admin-form login-form" onSubmit={submit}><label>One-time setup key<input value={token} onChange={event=>setToken(event.target.value)} type="password" autoComplete="off" required minLength={40} maxLength={128}/></label><label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={100} required/></label><label>Choose a password<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><label>Confirm password<input name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><button className="button full" disabled={pending}>{pending?'Creating your account…':'Create owner account →'}</button><p className="form-message" role="status">{message}</p><p className="fine-print">At least 12 characters. This setup link stops working after the first owner account is created.</p></form>;
}