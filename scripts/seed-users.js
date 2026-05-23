const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding User Accounts via Upsert...");

  // Hashed passwords
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const userPasswordHash = await bcrypt.hash("user123", 10);

  // Upsert Admin (using email as unique identifier)
  const adminUser = await prisma.user.upsert({
    where: { email: "medavarapu.m@gmail.com" },
    update: {
      username: "admin",
      password: adminPasswordHash,
      role: "ADMIN"
    },
    create: {
      username: "admin",
      email: "medavarapu.m@gmail.com",
      password: adminPasswordHash,
      role: "ADMIN"
    }
  });
  console.log(`Upserted Admin Account: email="medavarapu.m@gmail.com" password="admin123" role="${adminUser.role}"`);

  // Upsert Standard User
  const standardUser = await prisma.user.upsert({
    where: { email: "user@auraai.com" },
    update: {
      username: "ai_explorer",
      password: userPasswordHash,
      role: "USER"
    },
    create: {
      username: "ai_explorer",
      email: "user@auraai.com",
      password: userPasswordHash,
      role: "USER"
    }
  });
  console.log(`Upserted User Account: email="user@auraai.com" password="user123" role="${standardUser.role}"`);

  console.log("User accounts seed completed successfully!");
}

main()
  .catch(e => {
    console.error("Seeding users failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
