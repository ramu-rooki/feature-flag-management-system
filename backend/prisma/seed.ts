import { Role } from "@prisma/client";
import prisma from "../src/config/prisma";

async function main() {
  console.log("Start seeding...");

  // Seed SUPER ADMIN
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@byepo.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@byepo.com",
      passwordHash: "hashedpassword123", // Placeholder for Phase 2
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("Created Super Admin:", superAdmin.email);

  // Seed ORGANIZATION
  const organization = await prisma.organization.upsert({
    where: { name: "Velan Manufacturing" },
    update: {},
    create: {
      name: "Velan Manufacturing",
    },
  });
  console.log("Created Organization:", organization.name);

  // Seed ORG ADMIN
  const orgAdmin = await prisma.user.upsert({
    where: { email: "admin@velan.com" },
    update: {},
    create: {
      name: "Velan Admin",
      email: "admin@velan.com",
      passwordHash: "hashedpassword123", // Placeholder for Phase 2
      role: Role.ORG_ADMIN,
      organizationId: organization.id,
    },
  });
  console.log("Created Org Admin:", orgAdmin.email);

  // Seed FEATURE FLAGS
  const flags = [
    { featureKey: "new_dashboard", enabled: true },
    { featureKey: "dark_mode", enabled: false },
    { featureKey: "beta_reports", enabled: true },
  ];

  for (const flag of flags) {
    const createdFlag = await prisma.featureFlag.upsert({
      where: {
        organizationId_featureKey: {
          organizationId: organization.id,
          featureKey: flag.featureKey,
        },
      },
      update: {},
      create: {
        featureKey: flag.featureKey,
        enabled: flag.enabled,
        organizationId: organization.id,
      },
    });
    console.log(`Created Feature Flag: ${createdFlag.featureKey} = ${createdFlag.enabled}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
