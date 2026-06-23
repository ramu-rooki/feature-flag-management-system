import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { validateSignup, validateLogin } from "./auth.validation";
import { AppError } from "../../utils/AppError";

const authService = new AuthService();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateSignup(req.body);
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateLogin(req.body);
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const superAdminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateLogin(req.body);
    const result = await authService.superAdminLogin(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("User not found in request", 401);
    }
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};
