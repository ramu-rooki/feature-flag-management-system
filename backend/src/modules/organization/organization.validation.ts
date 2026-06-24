import { AppError } from "../../utils/AppError";
import { CreateOrganizationDto } from "./organization.types";

export const validateCreateOrganization = (data: Partial<CreateOrganizationDto>) => {
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    throw new AppError("Organization name is required and cannot be empty", 400);
  }
  
  const name = data.name.trim();
  
  if (name.length < 3) {
    throw new AppError("Organization name must be at least 3 characters long", 400);
  }
  
  if (name.length > 100) {
    throw new AppError("Organization name cannot exceed 100 characters", 400);
  }
};
