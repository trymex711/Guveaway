import { Prisma } from '@prisma/client';
import { adminSession, sameOrigin } from '@/lib/admin-access';
import { listingSchema } from '@/lib/admin-validation';
import { db } from '@/lib/db';

async function save(request: Request, update: boolean) {
  const session = await adminSession(request.headers);
  if (!session) return Response.json({ message: 'Admin sign-in required.' }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ message: 'Invalid request origin.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) return Response.json({ message: parsed.error.issues[0]?.message ?? 'Invalid listing.' }, { status: 400 });
  const { revision, ...data } = parsed.data;
  if (update && (typeof body.id !== 'string' || !revision)) return Response.json({ message: 'A listing ID and revision are required.' }, { status: 400 });
  try {
    const listing = await db.$transaction(async tx => {
      if (update) {
        const changed = await tx.adminListing.updateMany({ where: { id: body.id, revision }, data: { ...data, revision: { increment: 1 } } });
        if (changed.count !== 1) throw new Error('CONFLICT');
      }
      const item = update ? await tx.adminListing.findUniqueOrThrow({ where: { id: body.id } }) : await tx.adminListing.create({ data });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: update ? 'LISTING_UPDATED' : 'LISTING_CREATED', entityId: item.id, data: { title: item.title, status: item.status, revision: item.revision } } });
      return item;
    });
    return Response.json({ id: listing.id, revision: listing.revision });
  } catch (error) {
    if (error instanceof Error && error.message === 'CONFLICT') return Response.json({ message: 'This listing changed in another tab. Reload before saving.' }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return Response.json({ message: 'That URL slug is already in use.' }, { status: 409 });
    return Response.json({ message: 'The listing could not be saved. Try again.' }, { status: 500 });
  }
}
export async function POST(request: Request) { return save(request, false); }
export async function PATCH(request: Request) { return save(request, true); }
