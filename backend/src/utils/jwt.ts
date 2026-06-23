import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../types/role";

export interface JwtPayload {
  userId: string;
  role: Role;
  organizationId?: string | null;
}

/**
 * Generates a JWT token for a user.
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
