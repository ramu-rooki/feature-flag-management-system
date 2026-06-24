import { OrganizationRepository } from "./organization.repository";
import { CreateOrganizationDto, OrganizationResponseDto } from "./organization.types";
import { AppError } from "../../utils/AppError";

export class OrganizationService {
  private repository: OrganizationRepository;

  constructor() {
    this.repository = new OrganizationRepository();
  }

  async createOrganization(data: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    const name = data.name.trim();

    // Check duplicate
    const existing = await this.repository.findOrganizationByName(name);
    if (existing) {
      throw new AppError("Organization already exists", 409);
    }

    const organization = await this.repository.createOrganization({ name });
    return organization;
  }

  async getOrganizations(): Promise<{ count: number; data: OrganizationResponseDto[] }> {
    const [count, data] = await Promise.all([
      this.repository.countOrganizations(),
      this.repository.findAllOrganizations()
    ]);
    return { count, data };
  }

  async getOrganizationById(id: string): Promise<OrganizationResponseDto> {
    const organization = await this.repository.findOrganizationById(id);
    if (!organization) {
      throw new AppError("Organization not found", 404);
    }
    return organization;
  }
}
