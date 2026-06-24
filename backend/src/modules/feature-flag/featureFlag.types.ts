export interface CreateFeatureFlagDto {
  featureKey: string;
  enabled?: boolean;
}

export interface UpdateFeatureFlagDto {
  featureKey?: string;
  enabled?: boolean;
}

export interface FeatureFlagResponseDto {
  id: string;
  featureKey: string;
  enabled: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureFlagListDto {
  success: boolean;
  count: number;
  data: FeatureFlagResponseDto[];
}
