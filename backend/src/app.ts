import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

import prisma from "./config/prisma";

import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organization/organization.routes";
import featureFlagRoutes from "./modules/feature-flag/featureFlag.routes";
import featureCheckRoutes from "./modules/feature-check/featureCheck.routes";
const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/feature-flags", featureFlagRoutes);
app.use("/api/feature-check", featureCheckRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running"
  });
});

app.get("/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: "disconnected"
    });
  }
});

// Centralized error handler should be the last middleware
app.use(errorHandler);

export default app;
