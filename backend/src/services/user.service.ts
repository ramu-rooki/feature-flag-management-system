import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { handleDatabaseError } from "../utils/databaseErrors";
import { Role } from "../types/role";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: { name: string; email: string; passwordHash: string; role?: Role; organizationId?: string }) {
    if (data.role === Role.SUPER_ADMIN && data.organizationId) {
      throw new AppError("SUPER_ADMIN cannot be assigned to an organization", 400);
    }
    
    if (data.role !== Role.SUPER_ADMIN && !data.organizationId) {
      throw new AppError("Non-admin users must belong to an organization", 400);
    }

    try {
      return await this.userRepository.create(data as any);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }
}
