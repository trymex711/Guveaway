# Extraordinary Draws

Standalone luxury house and car giveaway platform. Separate from NEXUS.

## Implemented

- Responsive public collection, category tabs, prize pages and a local demo basket.
- Database-backed catalogue: published listings appear publicly; drafts and archived listings stay private.
- Private owner admin at /admin: overview, prize creation/editing, entry prices and limits, draft/publish/archive, built-in photos or custom HTTPS image URLs, optimistic edit conflict detection and audit history.
- Better Auth owner login, database sessions, shared database rate limits, disabled public signup and server-side authorization on each protected page and mutation.
- One-time owner setup. Only the configured ADMIN_EMAIL can access the private office. Setup is serialized in the database and stops after the first identity is created.
- Read-only users, order/entry records, draw history and audit pages, with genuine empty states.

The site remains a demo. Publishing is catalogue publishing only. Real payments, ticket issuance, participant registration, refunds, complimentary entries and draw execution are not enabled. File uploads are not implemented; photos use supplied images or direct HTTPS URLs.

## Local development

Use Node.js 22 or newer. Run npm install.

Without DATABASE_URL, the public UI uses the bundled demo catalogue; admin is unavailable. With a database, copy .env.example to .env and configure it. Set BETTER_AUTH_URL to the exact origin and port used to visit the app (for example http://127.0.0.1:3001). Never commit .env or other actual credential files.

    npm run db:migrate
    npm run db:seed
    npm run dev

Migrations use DIRECT_DATABASE_URL (a non-pooled connection). Application requests use DATABASE_URL (pooled on Neon). The seed is idempotent and does not overwrite edited prizes.

## Owner access

The owner for this deployment is rngleaks@gmail.com. A private .admin-setup.txt file on the setup machine contains the production setup link. Open it yourself to choose your password (12–128 characters), then sign in at /admin/login. Setup keys travel in the URL fragment, are removed from browser history by the form, and are submitted only to the same-origin setup endpoint. Only the SHA-256 hash is stored in Vercel. The setup link ceases to work after the first owner identity is created.

There is no public signup, email reset flow, or staff invitation UI yet. Keep the chosen password in your password manager. A future recovery flow must verify the owner before changing credentials.

## Validation

    npm test
    npm run typecheck
    npm run build

The integration suite needs a running development server and an isolated database:

    npx next dev --port 3002 --hostname 127.0.0.1
    npm run test:integration

For that suite, .env must set BETTER_AUTH_URL=http://127.0.0.1:3002 and ADMIN_TEST_DATABASE=true and .admin-setup-dev.txt must contain that development instance's setup link. Tests create a development-only owner identity, unprivileged identities, and an archived sample listing. Never point them at production. The suite tests anonymous access, bootstrap, blocked signup/plugin endpoints, login, CSRF rejection, role checks, draft/publish/archive, conflict detection, audit writes and logout.

## Deployment

GitHub main deploys through the separate guveaway Vercel project. Set production-only database URLs, BETTER_AUTH_URL, BETTER_AUTH_SECRET, ADMIN_EMAIL, and ADMIN_SETUP_TOKEN_HASH privately. Never share production database credentials with preview deployments. Run reviewed migrations before deploying code that needs them; do not run automatic migrations in every build.

Database: dedicated Neon project extraordinary-draws-giveaway in eu-central-1. Development and production are separate branches. Auth uses self-managed Better Auth on the app host so the custom single-use bootstrap and strict public route allowlist remain under application control. Prisma owns the complete schema and migrations.

Prisma 6.19 tooling retains the previously documented transitive high-severity advisories. npm recommends a separate major Prisma migration. Next.js is patched to 16.3.8.

## Photography

Illustrative Unsplash images are served locally. Residence: https://images.unsplash.com/photo-1600585154340-be6161a56a0c . Car: https://images.unsplash.com/photo-1503376780353-7e6692767b70 . These concept photos do not identify actual prizes.