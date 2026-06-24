import { Router } from "express";
import {
  createFeatureFlag,
  getFeatureFlags,
  getFeatureFlagById,
  updateFeatureFlag,
  deleteFeatureFlag,
  toggleFeatureFlag
} from "./featureFlag.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { Role } from "../../types/role";

const router = Router();

// All routes require authentication and ORG_ADMIN authorization
router.use(authenticate);
router.use(authorize([Role.ORG_ADMIN]));

router.post("/", createFeatureFlag);
router.get("/", getFeatureFlags);
router.get("/:id", getFeatureFlagById);
router.put("/:id", updateFeatureFlag);
router.delete("/:id", deleteFeatureFlag);
router.patch("/:id/toggle", toggleFeatureFlag);

export default router;
