const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.photo.deleteMany({
    where: {
      url: {
        startsWith: "data:image"
      }
    }
  });
  console.log("Deleted", result.count, "large base64 photos");
}
main().catch(console.error).finally(() => prisma.$disconnect());
