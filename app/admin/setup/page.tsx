import Link from 'next/link';
import { db } from '@/lib/db';
import { adminConfigured } from '@/lib/auth';
import { AdminSetup } from '@/components/admin-setup';
export const dynamic = 'force-dynamic';
export default async function SetupPage() {
  if (!adminConfigured()) return <section className="shell admin-login"><h1>Setup unavailable.</h1><p>Database and authentication configuration are required.</p></section>;
  const exists = await db.adminIdentity.count();
  return <section className="shell admin-login"><span className="eyebrow">PRIVATE OWNER SETUP</span><h1>{exists ? 'Your account is ready.' : 'Make it yours.'}</h1>{exists ? <><p>Owner setup is complete. Sign in with your chosen password.</p><Link href="/admin/login" className="button">Go to sign in →</Link></> : <><p>Create your designated owner account.<br/>Use the one-time setup link provided privately by the site owner.</p><AdminSetup /></>}</section>;
}