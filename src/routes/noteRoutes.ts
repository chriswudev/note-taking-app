import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController";
import { authenticateUser } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";

const router = express.Router();

router.post("/", authenticateUser, validateRequest, createNote);
router.get("/", authenticateUser, getAllNotes);
router.get("/:id", authenticateUser, getNoteById);
router.put("/:id", authenticateUser, updateNote);
router.delete("/:id", authenticateUser, deleteNote);

export default router;
