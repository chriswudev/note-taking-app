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
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllNotes = async (req: RequestWithUser, res: Response) => {
  const userId = req.user?._id;
  const { search } = req.query;

  try {
    if (search) {
      const notes = await Note.find(
        { userId, $text: { $search: search as string } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });

      res.status(200).json(notes);
    } else {
      const notes = await Note.find({ userId });
      res.status(200).json(notes);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getNoteById = async (req: RequestWithUser, res: Response) => {
  const userId = req.user?._id;
  const noteId = req.params.id;

  try {
    const note = await Note.findOne({ userId, _id: noteId });
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateNote = async (req: RequestWithUser, res: Response) => {
  const noteId = req.params.id;
  const userId = req.user?._id;
  const { title, body, tags } = req.body;

  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, body, tags },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteNote = async (req: RequestWithUser, res: Response) => {
  const noteId = req.params.id;
  const userId = req.user?._id;

  try {
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
