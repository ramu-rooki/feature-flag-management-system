import { Router } from "express";
import { createOrganization, getOrganizations, getOrganizationById } from "./organization.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { Role } from "../../types/role";

const router = Router();

// All organization routes require authentication and SUPER_ADMIN authorization
router.use(authenticate);
router.use(authorize([Role.SUPER_ADMIN]));

router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get("/:id", getOrganizationById);

export default router;
