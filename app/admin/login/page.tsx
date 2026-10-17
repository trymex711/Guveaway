import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { adminSession } from '@/lib/admin-access';
import { adminConfigured } from '@/lib/auth';
import { AdminLogin } from '@/components/admin-login';
export const dynamic = 'force-dynamic';
export default async function LoginPage() {
  if (await adminSession(await headers())) redirect('/admin');
  return <section className="admin-login shell"><span className="eyebrow">EXTRAORDINARY DRAWS · PRIVATE ACCESS</span><h1>A considered view.<br/>Complete control.</h1><p>Sign in to manage your collection.</p>{adminConfigured() ? <AdminLogin /> : <div className="admin-notice">Admin login is not configured. Set the database and authentication environment variables before signing in.</div>}</section>;
}