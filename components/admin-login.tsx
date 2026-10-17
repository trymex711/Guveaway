'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function AdminLogin() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setMessage('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/sign-in/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) });
      if (!response.ok) { setMessage(response.status === 429 ? 'Too many attempts. Please wait a minute before trying again.' : 'Unable to sign in. Check your email and password.'); return; }
      router.replace('/admin'); router.refresh();
    } catch { setMessage('Unable to connect. Please try again.'); } finally { setPending(false); }
  }
  return <form className="admin-form login-form" onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={128}/></label><button className="button full" disabled={pending}>{pending ? 'Signing in…' : 'Sign in →'}</button><p role="status" className="form-message">{message}</p><p className="fine-print">Private owner access. Public registration is disabled.</p></form>;
}