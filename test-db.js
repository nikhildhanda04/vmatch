const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.$connect();
  console.log("Connected successfully!");
  const userCount = await prisma.user.count();
  console.log({ userCount });
}
main().catch(console.error).finally(() => prisma.$disconnect());
