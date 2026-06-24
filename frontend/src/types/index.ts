export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  END_USER: 'END_USER',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId?: string | null;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface OrganizationListResponse {
  success: boolean;
  count: number;
  data: Organization[];
}

export interface FeatureFlag {
  id: string;
  featureKey: string;
  enabled: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlagListResponse {
  success: boolean;
  count: number;
  data: FeatureFlag[];
}

export interface FeatureCheckResponse {
  success: boolean;
  featureKey: string;
  enabled: boolean;
}
