import { PrismaClient } from "@prisma/client";

// Force TS server to re-parse
const prisma = new PrismaClient();

export default prisma;
