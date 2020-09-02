const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const newSensor = await prisma.sensor.create({
    data: {},
  });
  newSensor();

  const allSensors = await prisma.link.findMany();
  console.log(allSensors);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
