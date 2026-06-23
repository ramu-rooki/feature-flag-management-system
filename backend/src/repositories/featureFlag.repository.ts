import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

export class FeatureFlagRepository {
  async create(data: Prisma.FeatureFlagUncheckedCreateInput) {
    return prisma.featureFlag.create({ data });
  }

  async findByKeyAndOrg(featureKey: string, organizationId: string) {
    return prisma.featureFlag.findUnique({
      where: { organizationId_featureKey: { organizationId, featureKey } },
    });
  }

  async findAllByOrg(organizationId: string) {
    return prisma.featureFlag.findMany({ where: { organizationId } });
  }

  async update(id: string, enabled: boolean) {
    return prisma.featureFlag.update({
      where: { id },
      data: { enabled },
    });
  }
}
