import { getAuth, adminConfigured } from '@/lib/auth';

// Only expose sign-in, sign-out and session reading. Account creation and role
// management are server-only; no public Better Auth admin/plugin endpoints.
async function handle(request: Request) {
  if (!adminConfigured()) return Response.json({ message: 'Admin login is not configured.' }, { status: 503 });
  const path = new URL(request.url).pathname.replace('/api/auth', '');
  if (!['/sign-in/email', '/sign-out', '/get-session'].includes(path)) return Response.json({ message: 'Not found.' }, { status: 404 });
  return getAuth().handler(request);
}
export const GET = handle;
export const POST = handle;
