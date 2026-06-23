import { FeatureFlagRepository } from "../repositories/featureFlag.repository";
import { AppError } from "../utils/AppError";
import { handleDatabaseError } from "../utils/databaseErrors";

export class FeatureFlagService {
  private featureFlagRepository: FeatureFlagRepository;

  constructor() {
    this.featureFlagRepository = new FeatureFlagRepository();
  }

  async createFeatureFlag(data: { featureKey: string; enabled?: boolean; organizationId: string }) {
    try {
      return await this.featureFlagRepository.create(data);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getFeatureFlag(featureKey: string, organizationId: string) {
    const flag = await this.featureFlagRepository.findByKeyAndOrg(featureKey, organizationId);
    if (!flag) throw new AppError("Feature flag not found", 404);
    return flag;
  }

  async getAllByOrganization(organizationId: string) {
    return this.featureFlagRepository.findAllByOrg(organizationId);
  }
}
