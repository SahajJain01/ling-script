/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dev database...');

  // Wipe existing data for a clean dev state
  await prisma.prompt.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.lang.deleteMany();

  // Sample data
  const langs = [
    {
      name: 'Spanish',
      units: [
        {
          name: 'Basics',
          prompts: [
            { content: 'Hello', answer: 'Hola' },
            { content: 'Thank you', answer: 'Gracias' },
            { content: 'Please', answer: 'Por favor' },
          ],
        },
        {
          name: 'Phrases',
          prompts: [
            { content: 'Good morning', answer: 'Buenos días' },
            { content: 'See you later', answer: 'Hasta luego' },
          ],
        },
      ],
    },
    {
      name: 'French',
      units: [
        {
          name: 'Basics',
          prompts: [
            { content: 'Hello', answer: 'Bonjour' },
            { content: 'Goodbye', answer: 'Au revoir' },
          ],
        },
      ],
    },
  ];

  for (const l of langs) {
    await prisma.lang.create({
      data: {
        name: l.name,
        units: {
          create: l.units.map((u) => ({
            name: u.name,
            prompts: { create: u.prompts.map((p) => ({ content: p.content, answer: p.answer })) },
          })),
        },
      },
    });
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

