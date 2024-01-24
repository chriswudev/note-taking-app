import { Response } from "express";
import Note from "../models/Note";
import { RequestWithUser } from "../types";

const createNote = async (req: RequestWithUser, res: Response) => {
  const { title, body, tags } = req.body;
  const userId = req.user?._id; // Assuming you have middleware to attach user to request

  const note = new Note({ title, body, tags, userId });

  try {
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllNotes = async (req: RequestWithUser, res: Response) => {
  const userId = req.user?._id;

  try {
    const notes = await Note.find({ userId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createNote, getAllNotes };
