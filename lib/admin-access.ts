import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth, adminConfigured } from './auth';

export async function adminSession(requestHeaders: Headers) {
  if (!adminConfigured()) return null;
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session || session.user.banned || session.user.role !== 'admin' || session.user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) return null;
  return session;
}

export async function requireAdmin() {
  const session = await adminSession(await headers());
  if (!session) redirect('/admin/login');
  return session;
}

export function sameOrigin(request: Request) {
  const expected = new URL(process.env.BETTER_AUTH_URL ?? request.url).origin;
  return request.headers.get('origin') === expected;
}
