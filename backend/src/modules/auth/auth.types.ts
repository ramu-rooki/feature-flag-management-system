import { Role } from "../../types/role";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  organizationId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    organizationId: string | null;
  };
}

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        organizationId?: string | null;
      };
    }
  }
}
