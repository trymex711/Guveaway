import { createHash, timingSafeEqual } from 'node:crypto';
import { db } from '@/lib/db';
import { createAuth, adminConfigured } from '@/lib/auth';
import { sameOrigin } from '@/lib/admin-access';
import { setupSchema } from '@/lib/admin-validation';

export async function POST(request: Request) {
  if (!adminConfigured() || !process.env.ADMIN_SETUP_TOKEN_HASH) return Response.json({ message: 'Setup is not configured.' }, { status: 503 });
  if (!sameOrigin(request)) return Response.json({ message: 'Invalid request origin.' }, { status: 403 });
  const input = setupSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return Response.json({ message: 'Enter your name, setup key, and a password of 12–128 characters.' }, { status: 400 });
  const hash = createHash('sha256').update(input.data.token).digest();
  const expected = Buffer.from(process.env.ADMIN_SETUP_TOKEN_HASH, 'hex');
  if (expected.length !== hash.length || !timingSafeEqual(hash, expected)) return Response.json({ message: 'Invalid or expired setup key.' }, { status: 403 });
  try {
    const created = await db.$transaction(async tx => {
      // A transaction-scoped lock serializes claims across serverless instances.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(71620419)`;
      if (await tx.adminIdentity.count() || await tx.systemConfiguration.findUnique({ where: { key: 'admin-setup-complete' } })) return false;
      const result = await createAuth(tx).api.createUser({ body: { email: process.env.ADMIN_EMAIL!, name: input.data.name, password: input.data.password, role: 'admin' } });
      await tx.systemConfiguration.create({ data: { key: 'admin-setup-complete', value: { userId: result.user.id } } });
      await tx.auditLog.create({ data: { actorId: result.user.id, action: 'ADMIN_CREATED', entityId: result.user.id, data: { email: result.user.email } } });
      return true;
    }, { timeout: 30000 });
    if (!created) return Response.json({ message: 'Setup is already complete. Please sign in.' }, { status: 409 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ message: 'Setup could not be completed. Please try signing in, or contact the site owner.' }, { status: 500 });
  }
}
