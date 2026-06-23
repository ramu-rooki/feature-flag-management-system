import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { Role } from "../types/role";

// Re-evaluating types...

export const authorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden: Insufficient permissions", 403));
    }

    next();
  };
};
