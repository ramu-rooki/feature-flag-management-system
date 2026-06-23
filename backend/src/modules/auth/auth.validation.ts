import { AppError } from "../../utils/AppError";
import { SignupRequest, LoginRequest } from "./auth.types";

export const validateSignup = (data: SignupRequest) => {
  if (!data.name || data.name.trim() === "") {
    throw new AppError("Name is required", 400);
  }
  if (!data.organizationId || data.organizationId.trim() === "") {
    throw new AppError("Organization ID is required", 400);
  }
  validateEmail(data.email);
  validatePasswordStrength(data.password);
};

export const validateLogin = (data: LoginRequest) => {
  if (!data.email || !data.password) {
    throw new AppError("Email and password are required", 400);
  }
  validateEmail(data.email);
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400);
  }
};

const validatePasswordStrength = (password: string) => {
  if (!password || password.length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }
};
