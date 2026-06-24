import { AppError } from "../../utils/AppError";
import { CreateFeatureFlagDto, UpdateFeatureFlagDto } from "./featureFlag.types";

export const validateFeatureKey = (key: string): string => {
  if (!key || typeof key !== "string" || key.trim() === "") {
    throw new AppError("Feature key is required and cannot be empty", 400);
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

export const validateCreateFeatureFlag = (data: Partial<CreateFeatureFlagDto>): CreateFeatureFlagDto => {
  if (data.featureKey === undefined) {
    throw new AppError("Feature key is required", 400);
  }
  const featureKey = validateFeatureKey(data.featureKey);
  const enabled = typeof data.enabled === "boolean" ? data.enabled : false;

  return { featureKey, enabled };
};

export const validateUpdateFeatureFlag = (data: Partial<UpdateFeatureFlagDto>): UpdateFeatureFlagDto => {
  const result: UpdateFeatureFlagDto = {};

  if (data.featureKey !== undefined) {
    result.featureKey = validateFeatureKey(data.featureKey);
  }

  if (data.enabled !== undefined) {
    if (typeof data.enabled !== "boolean") {
      throw new AppError("Enabled must be a boolean", 400);
    }
    result.enabled = data.enabled;
  }

  if (Object.keys(result).length === 0) {
    throw new AppError("No valid fields to update", 400);
  }

  return result;
};
