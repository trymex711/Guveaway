import { PrismaClient } from '@prisma/client';

const globalDb = globalThis as unknown as { giveawayDb?: PrismaClient };
export const db = globalDb.giveawayDb ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalDb.giveawayDb = db;
