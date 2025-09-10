/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function resolveDbFile() {
  const url = process.env.DATABASE_URL || 'file:../data/ling.db';
  if (!url.startsWith('file:')) return null; // only handle sqlite file URLs here
  const fileRel = url.replace('file:', '');
  // Prisma resolves relative SQLite paths against the schema directory (./prisma)
  const prismaDir = path.resolve(process.cwd(), 'prisma');
  const base = path.isAbsolute(fileRel) ? '' : prismaDir;
  return path.resolve(base, fileRel);
}

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function main() {
  const dbFile = resolveDbFile();
  if (dbFile) {
    if (fs.existsSync(dbFile)) {
      console.log(`Removing existing DB file: ${dbFile}`);
      try {
        fs.unlinkSync(dbFile);
      } catch (e) {
        console.warn('Failed to delete DB file directly, trying rm -f');
        try { run(process.platform === 'win32' ? `del /f "${dbFile}"` : `rm -f "${dbFile}"`); } catch (_) {}
      }
    } else {
      console.log(`No DB file found at: ${dbFile}`);
    }
  } else {
    console.log('DATABASE_URL is not a file: URL; skipping file removal.');
  }

  run('bunx prisma generate');
  run('bunx prisma db push --skip-generate');
  run('bun prisma/seed.js');
}

main();
