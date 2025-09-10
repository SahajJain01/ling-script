/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function resolveDbFile() {
  const url = process.env.DATABASE_URL || 'file:../data/ling.db';
  if (!url.startsWith('file:')) return null; // only handle sqlite file URLs here
  const fileRel = url.replace('file:', '');
  // Prisma resolves relative SQLite paths against the schema directory (./prisma)
  const prismaDir = path.resolve(process.cwd(), 'prisma');
  const base = path.isAbsolute(fileRel) ? '' : prismaDir;
  return path.resolve(base, fileRel);
}

function main() {
  const dbFile = resolveDbFile();
  if (!dbFile) {
    console.log('DATABASE_URL is not a file: URL; skipping ensure-data-dir');
    return;
  }
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) {
    console.log(`Creating data directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

main();

