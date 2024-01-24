import express from "express";
import { register, login } from "../controllers/authController";
import { validateRequest } from "../middleware/validationMiddleware";

const router = express.Router();

router.post("/register", validateRequest, register);
router.post("/login", validateRequest, login);

export default router;
