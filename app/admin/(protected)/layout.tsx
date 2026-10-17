import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-access';
import { AdminNavigation } from '@/components/admin-navigation';
export const dynamic = 'force-dynamic';
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return <section className="shell admin-workspace"><aside className="admin-sidebar"><span className="eyebrow">THE PRIVATE OFFICE</span><AdminNavigation/><div className="admin-owner"><span>Signed in as</span><strong>{session.user.name}</strong><small>{session.user.email}</small><Link href="/">View website ↗</Link></div></aside><div className="admin-main">{children}</div></section>;
}