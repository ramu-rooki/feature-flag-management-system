import { Router } from "express";
import { signup, login, superAdminLogin, getProfile } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/super-admin/login", superAdminLogin);
router.get("/profile", authenticate, getProfile);

export default router;
