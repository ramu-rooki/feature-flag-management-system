export interface CheckFeatureRequestDto {
  featureKey: string;
}

export interface CheckFeatureResponseDto {
  success: boolean;
  featureKey: string;
  enabled: boolean;
}
