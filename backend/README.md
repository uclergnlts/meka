# MEKA Backend

## Database

The backend uses PostgreSQL with Prisma.

```bash
npm run db:up
npm run db:push
npm run db:seed
```

Default local database URL:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meka?schema=public
```

If Docker Desktop is not running, `npm run db:up` cannot start PostgreSQL.
