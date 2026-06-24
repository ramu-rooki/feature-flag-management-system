import { Router } from "express";
import { checkFeature } from "./featureCheck.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { Role } from "../../types/role";

const router = Router();

// Endpoint accessible by END_USER and ORG_ADMIN
router.use(authenticate);
router.use(authorize([Role.END_USER, Role.ORG_ADMIN]));

router.post("/", checkFeature);
router.get("/:featureKey", checkFeature);

export default router;
