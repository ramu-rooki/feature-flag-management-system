import prisma from "../../config/prisma";

export class FeatureCheckRepository {
  async findFeatureByKeyAndOrganization(featureKey: string, organizationId: string) {
    return prisma.featureFlag.findFirst({
      where: {
        featureKey,
        organizationId
      },
      select: {
        enabled: true
      }
    });
  }
}
