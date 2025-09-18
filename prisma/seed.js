/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
async function main() {
  console.log('Seeding dev database...');

  const destructive = process.env.DESTRUCTIVE_SEED === 'true';
  if (destructive) {
    console.log('Destructive seed enabled: clearing existing data');
    await prisma.prompt.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.lang.deleteMany();
  }

  // Languages with prompts: native script -> romanization (not translation)
  const langs = [
    require('./langs/japanese.json'),
    require('./langs/korean.json'),
    require('./langs/chinese.json'),
    require('./langs/russian.json'),
  ];

  // Idempotent upsert by names (no unique constraints required)
  for (const l of langs) {
    let lang = await prisma.lang.findFirst({ where: { name: l.name } });
    if (!lang) {
      lang = await prisma.lang.create({ data: { name: l.name } });
    }
    for (const u of l.units) {
      let unit = await prisma.unit.findFirst({ where: { name: u.name, langId: lang.id } });
      if (!unit) {
        unit = await prisma.unit.create({ data: { name: u.name, langId: lang.id } });
      }
      for (const p of u.prompts) {
        const existing = await prisma.prompt.findFirst({ where: { unitId: unit.id, content: p.content } });
        const desiredNotes = p.notes ?? null;
        if (!existing) {
          await prisma.prompt.create({
            data: {
              content: p.content,
              answer: p.answer,
              notes: desiredNotes,
              unitId: unit.id,
            },
          });
        } else {
          const updates = {};
          if (existing.answer !== p.answer) updates.answer = p.answer;
          if ((existing.notes ?? null) !== desiredNotes) updates.notes = desiredNotes;
          if (Object.keys(updates).length) {
            await prisma.prompt.update({ where: { id: existing.id }, data: updates });
          }
        }
      }
    }
  }
  const langCount = await prisma.lang.count();
  const unitCount = await prisma.unit.count();
  const promptCount = await prisma.prompt.count();
  console.log(`Seeded: ${langCount} langs, ${unitCount} units, ${promptCount} prompts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

