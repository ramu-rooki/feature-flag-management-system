import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "./organization.service";
import { validateCreateOrganization } from "./organization.validation";
import { AppError } from "../../utils/AppError";
import { validate as validateUUID } from "uuid";

const organizationService = new OrganizationService();

export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateCreateOrganization(req.body);
    const name = req.body.name.trim();

    const result = await organizationService.createOrganization({ name });
    
    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count, data } = await organizationService.getOrganizations();
    res.status(200).json({
      success: true,
      count,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    
    if (!validateUUID(id)) {
      throw new AppError("Invalid UUID format", 400);
    }

    const data = await organizationService.getOrganizationById(id);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
