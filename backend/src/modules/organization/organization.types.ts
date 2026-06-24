export interface CreateOrganizationDto {
  name: string;
}

export interface OrganizationResponseDto {
  id: string;
  name: string;
  createdAt: Date;
}

export interface OrganizationListDto {
  success: boolean;
  count: number;
  data: OrganizationResponseDto[];
}
