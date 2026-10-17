# Extraordinary Draws

Standalone giveaway platform with no dependency on NEXUS.

## Implemented

Responsive Next.js catalogue with category filters and search, static prize detail pages, and a browser-local demo basket. All prizes, prices, and allocation counts are illustrative. No payments, ticket issuance, or active draws are implemented. The existing Prisma schema is preserved.

## Run

Use Node.js 22 or newer. Run npm install, then npm run dev. Open http://localhost:3001. The demo UI requires no database.

Validation: npm run typecheck, npm test, npm run build. Build also generates the Prisma client; copy the placeholder DATABASE_URL from .env.example if required by Prisma.

## Backend scaffold

docker-compose.yml provides local PostgreSQL. Database migrations, seed, worker, authentication, payment handling, draw execution, and integration tests remain unimplemented. Existing package scripts for these are placeholders. Do not run db:migrate as an initial schema setup until migrations are created and reviewed.

Next milestones: reviewed migrations and seed; verified user sessions and eligibility; transactional capacity reservations; idempotent sandbox payment webhooks; frozen draw manifests and auditable winner selection; admin permissions, refunds, and notifications.

The browser basket is untrusted input. Future checkout must validate quantities, prices, eligibility, availability, and rules on the server.
Dependency audit: Prisma 6.19 tooling currently has transitive high-severity advisories. npm proposes a Prisma 7 major upgrade; this needs a separate database configuration migration and validation. Next.js was patched to 16.3.8 to resolve its reported advisories.
