import { Prisma } from "@prisma/client";
import { AppError } from "./AppError";

export const handleDatabaseError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // Unique Constraint Violation
        const target = (error.meta?.target as string[])?.join(", ") || "field";
        throw new AppError(`Duplicate entry for ${target}.`, 409);
      case "P2025":
        // Record Not Found
        throw new AppError("Record not found.", 404);
      case "P2003":
        // Foreign Key Constraint Failure
        throw new AppError("Foreign key constraint failed.", 400);
      default:
        throw new AppError(`Database error: ${error.message}`, 500);
    }
  }
  throw new AppError("An unexpected database error occurred.", 500);
};
