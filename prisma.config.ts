import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Explicit schema path (default is ./prisma/schema.prisma)
  schema: path.join('prisma', 'schema.prisma'),
  // Configure how seeding is run when using Prisma commands that support it
  migrations: {
    // Runs your existing seed script (Bun executes the file with Node compat)
    seed: 'bun prisma/seed.js',
  },
});

