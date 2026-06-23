import prisma from "./prisma";

export async function testDB() {
  try {
    await prisma.$connect();
    console.log("Database Connected");
  } catch (error) {
    console.error(error);
  }
}
