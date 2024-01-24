import express from "express";
import { createNote, getAllNotes } from "../controllers/noteController";
import { authenticateUser } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";

const router = express.Router();

router.post("/", authenticateUser, validateRequest, createNote);
router.get("/", authenticateUser, getAllNotes);

export default router;
