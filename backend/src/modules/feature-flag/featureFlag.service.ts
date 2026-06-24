import { FeatureFlagRepository } from "./featureFlag.repository";
import { CreateFeatureFlagDto, UpdateFeatureFlagDto, FeatureFlagResponseDto } from "./featureFlag.types";
import { AppError } from "../../utils/AppError";

export class FeatureFlagService {
  private repository: FeatureFlagRepository;

  constructor() {
    this.repository = new FeatureFlagRepository();
  }

  async createFeatureFlag(organizationId: string, data: CreateFeatureFlagDto): Promise<FeatureFlagResponseDto> {
    const existing = await this.repository.findByFeatureKey(data.featureKey, organizationId);
    if (existing) {
      throw new AppError("Feature flag already exists in this organization", 409);
    }

    const featureFlag = await this.repository.create({
      featureKey: data.featureKey,
      enabled: data.enabled || false,
      organizationId
    });

    return featureFlag;
  }

  async getFeatureFlags(organizationId: string): Promise<{ count: number; data: FeatureFlagResponseDto[] }> {
    const [count, data] = await Promise.all([
      this.repository.count(organizationId),
      this.repository.findByOrganization(organizationId)
    ]);
    return { count, data };
  }

  async getFeatureFlagById(id: string, organizationId: string): Promise<FeatureFlagResponseDto> {
    const featureFlag = await this.repository.findById(id, organizationId);
    if (!featureFlag) {
      throw new AppError("Feature flag not found", 404);
    }
    return featureFlag;
  }

  async updateFeatureFlag(id: string, organizationId: string, data: UpdateFeatureFlagDto): Promise<FeatureFlagResponseDto> {
    const featureFlag = await this.getFeatureFlagById(id, organizationId);

    if (data.featureKey && data.featureKey !== featureFlag.featureKey) {
      const existing = await this.repository.findByFeatureKey(data.featureKey, organizationId);
      if (existing) {
        throw new AppError("Another feature flag with this key already exists in this organization", 409);
      }
    }

    await this.repository.update(id, organizationId, data);
    return this.getFeatureFlagById(id, organizationId);
  }

  async deleteFeatureFlag(id: string, organizationId: string): Promise<void> {
    await this.getFeatureFlagById(id, organizationId);
    await this.repository.delete(id, organizationId);
  }

  async toggleFeatureFlag(id: string, organizationId: string): Promise<FeatureFlagResponseDto> {
    const featureFlag = await this.getFeatureFlagById(id, organizationId);
    await this.repository.update(id, organizationId, { enabled: !featureFlag.enabled });
    return this.getFeatureFlagById(id, organizationId);
  }
}
