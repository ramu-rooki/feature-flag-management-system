import { FeatureCheckRepository } from "./featureCheck.repository";
import { CheckFeatureResponseDto } from "./featureCheck.types";

export class FeatureCheckService {
  private repository: FeatureCheckRepository;

  constructor() {
    this.repository = new FeatureCheckRepository();
  }

  async checkFeature(featureKey: string, organizationId: string): Promise<CheckFeatureResponseDto> {
    const feature = await this.repository.findFeatureByKeyAndOrganization(featureKey, organizationId);
    
    return {
      success: true,
      featureKey,
      enabled: feature ? feature.enabled : false
    };
  }
}
