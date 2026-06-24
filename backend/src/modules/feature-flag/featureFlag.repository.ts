import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export class FeatureFlagRepository {
  async create(data: Prisma.FeatureFlagUncheckedCreateInput) {
    return prisma.featureFlag.create({ data });
  }

  async findById(id: string, organizationId: string) {
    return prisma.featureFlag.findFirst({
      where: {
        id,
        organizationId
      }
    });
  }

  async findByOrganization(organizationId: string) {
    return prisma.featureFlag.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  }

  async findByFeatureKey(featureKey: string, organizationId: string) {
    return prisma.featureFlag.findFirst({
      where: {
        featureKey,
        organizationId
      }
    });
  }

  async update(id: string, organizationId: string, data: Prisma.FeatureFlagUncheckedUpdateInput) {
    return prisma.featureFlag.updateMany({
      where: {
        id,
        organizationId
      },
      data
    });
  }

  async delete(id: string, organizationId: string) {
    return prisma.featureFlag.deleteMany({
      where: {
        id,
        organizationId
      }
    });
  }

  async count(organizationId: string) {
    return prisma.featureFlag.count({
      where: { organizationId }
    });
  }
}
