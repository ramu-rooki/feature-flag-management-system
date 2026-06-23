import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

export class UserRepository {
  async create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({ data });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAllByOrganization(organizationId: string) {
    return prisma.user.findMany({ where: { organizationId } });
  }
}
