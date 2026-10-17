import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { db } from './db';
import type { Prisma, PrismaClient } from '@prisma/client';

let instance: ReturnType<typeof createAuth> | undefined;
export function createAuth(database: PrismaClient | Prisma.TransactionClient = db) {
  if (!process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL) throw new Error('Admin authentication is not configured.');
  return betterAuth({
    appName: 'Extraordinary Draws Admin',
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(database, { provider: 'postgresql' }),
    emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128 },
    user: { modelName: 'AdminIdentity' },
    session: { modelName: 'AdminSession', expiresIn: 60 * 60 * 8, updateAge: 60 * 60 },
    account: { modelName: 'AdminAccount' },
    verification: { modelName: 'AdminVerification' },
    rateLimit: { enabled: true, storage: 'database', modelName: 'AdminAuthRateLimit', window: 60, max: 60, customRules: { '/sign-in/email': { window: 60, max: 5 } } },
    plugins: [admin({ defaultRole: 'user' })],
  });
}

export function getAuth() { return instance ??= createAuth(); }
export function adminConfigured() { return Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET && process.env.BETTER_AUTH_URL && process.env.ADMIN_EMAIL); }
