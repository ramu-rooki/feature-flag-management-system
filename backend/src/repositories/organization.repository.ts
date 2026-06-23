import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

export class OrganizationRepository {
  async create(data: Prisma.OrganizationCreateInput) {
    return prisma.organization.create({ data });
  }

  async findById(id: string) {
    return prisma.organization.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return prisma.organization.findFirst({ where: { name } });
  }

  async findAll() {
    return prisma.organization.findMany();
  }
}
