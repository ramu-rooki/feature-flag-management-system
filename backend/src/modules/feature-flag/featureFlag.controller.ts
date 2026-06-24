import { Request, Response, NextFunction } from "express";
import { FeatureFlagService } from "./featureFlag.service";
import { validateCreateFeatureFlag, validateUpdateFeatureFlag } from "./featureFlag.validation";
import { AppError } from "../../utils/AppError";
import { validate as validateUUID } from "uuid";

const featureFlagService = new FeatureFlagService();

export const createFeatureFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) throw new AppError("User does not belong to an organization", 403);

    const validData = validateCreateFeatureFlag(req.body);
    const result = await featureFlagService.createFeatureFlag(organizationId, validData);
    
    res.status(201).json({
      success: true,
      message: "Feature flag created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getFeatureFlags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) throw new AppError("User does not belong to an organization", 403);

    const { count, data } = await featureFlagService.getFeatureFlags(organizationId);
    res.status(200).json({
      success: true,
      count,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getFeatureFlagById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) throw new AppError("User does not belong to an organization", 403);

    const id = req.params.id as string;
    if (!validateUUID(id)) throw new AppError("Invalid UUID format", 400);

    const data = await featureFlagService.getFeatureFlagById(id, organizationId);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const updateFeatureFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) throw new AppError("User does not belong to an organization", 403);

    const id = req.params.id as string;
    if (!validateUUID(id)) throw new AppError("Invalid UUID format", 400);

    const validData = validateUpdateFeatureFlag(req.body);
    const result = await featureFlagService.updateFeatureFlag(id, organizationId, validData);

    res.status(200).json({
      success: true,
      message: "Feature flag updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFeatureFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) throw new AppError("User does not belong to an organization", 403);

    const id = req.params.id as string;
    if (!validateUUID(id)) throw new AppError("Invalid UUID format", 400);

    await featureFlagService.deleteFeatureFlag(id, organizationId);

    res.status(200).json({
      success: true,
      message: "Feature flag deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFeatureFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) throw new AppError("User does not belong to an organization", 403);

    const id = req.params.id as string;
    if (!validateUUID(id)) throw new AppError("Invalid UUID format", 400);

    const result = await featureFlagService.toggleFeatureFlag(id, organizationId);

    res.status(200).json({
      success: true,
      message: "Feature flag toggled successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
