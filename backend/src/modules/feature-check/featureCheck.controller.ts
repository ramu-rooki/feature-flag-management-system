import { Request, Response, NextFunction } from "express";
import { FeatureCheckService } from "./featureCheck.service";
import { validateFeatureKeyForCheck } from "./featureCheck.validation";
import { AppError } from "../../utils/AppError";

const featureCheckService = new FeatureCheckService();

export const checkFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new AppError("User does not belong to an organization", 403);
    }

    // Support both GET (req.params) and POST (req.body)
    const rawKey = req.params.featureKey || req.body.featureKey;
    const featureKey = validateFeatureKeyForCheck(rawKey);

    const result = await featureCheckService.checkFeature(featureKey, organizationId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
