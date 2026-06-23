import { AuthRepository } from "./auth.repository";
import { SignupRequest, LoginRequest } from "./auth.types";
import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { handleDatabaseError } from "../../utils/databaseErrors";
import { Role } from "../../types/role";
import { env } from "../../config/env";

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async signup(data: SignupRequest) {
    const org = await this.authRepository.findOrganizationById(data.organizationId);
    if (!org) {
      throw new AppError("Invalid organization ID", 400);
    }

    const hashedPassword = await hashPassword(data.password);

    try {
      await this.authRepository.createUser({
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        organizationId: data.organizationId,
        role: Role.ORG_ADMIN,
      });
      return { success: true, message: "Account created successfully" };
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async login(data: LoginRequest) {
    const user = await this.authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({
      userId: user.id,
      role: user.role as Role,
      organizationId: user.organizationId,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        organizationId: user.organizationId,
      },
    };
  }

  async superAdminLogin(data: LoginRequest) {
    if (!env.SUPER_ADMIN_EMAIL || !env.SUPER_ADMIN_PASSWORD) {
      throw new AppError("Super Admin credentials are not configured", 500);
    }

    if (data.email !== env.SUPER_ADMIN_EMAIL || data.password !== env.SUPER_ADMIN_PASSWORD) {
      throw new AppError("Invalid super admin credentials", 401);
    }

    const token = generateToken({
      userId: "super-admin-system",
      role: Role.SUPER_ADMIN,
      organizationId: null,
    });

    return {
      success: true,
      token,
      user: {
        id: "super-admin-system",
        email: data.email,
        name: "System Super Admin",
        role: Role.SUPER_ADMIN,
        organizationId: null,
      },
    };
  }
}
