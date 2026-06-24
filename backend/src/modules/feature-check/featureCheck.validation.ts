import { AppError } from "../../utils/AppError";

export const validateFeatureKeyForCheck = (key: any): string => {
  if (!key || typeof key !== "string" || key.trim() === "") {
    throw new AppError("Feature key is required", 400);
  }

  const normalized = key.trim().toLowerCase();

  if (normalized.length < 2) {
    throw new AppError("Feature key must be at least 2 characters long", 400);
  }

  if (normalized.length > 100) {
    throw new AppError("Feature key cannot exceed 100 characters", 400);
  }

  const regex = /^[a-z0-9_]+$/;
  if (!regex.test(normalized)) {
    throw new AppError("Feature key can only contain lowercase letters, numbers, and underscores", 400);
  }

  return normalized;
};
