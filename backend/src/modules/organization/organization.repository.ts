import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export class OrganizationRepository {
  async createOrganization(data: Prisma.OrganizationCreateInput) {
    return prisma.organization.create({ data });
  }

  async findOrganizationById(id: string) {
    return prisma.organization.findUnique({ where: { id } });
  }

  async findOrganizationByName(name: string) {
    return prisma.organization.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        }
      }
    });
  }

  async findAllOrganizations() {
    return prisma.organization.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async countOrganizations() {
    return prisma.organization.count();
  }
}
