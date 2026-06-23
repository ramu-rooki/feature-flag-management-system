import { OrganizationRepository } from "../repositories/organization.repository";
import { AppError } from "../utils/AppError";
import { handleDatabaseError } from "../utils/databaseErrors";

export class OrganizationService {
  private organizationRepository: OrganizationRepository;

  constructor() {
    this.organizationRepository = new OrganizationRepository();
  }

  async createOrganization(name: string) {
    if (!name) throw new AppError("Organization name is required", 400);

    try {
      return await this.organizationRepository.create({ name });
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getOrganization(id: string) {
    const org = await this.organizationRepository.findById(id);
    if (!org) throw new AppError("Organization not found", 404);
    return org;
  }
}
