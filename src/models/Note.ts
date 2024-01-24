import mongoose, { Schema, Document } from "mongoose";

interface INote extends Document {
  title: string;
  body: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: { type: [String], default: [] },
  userId: { type: mongoose.Types.ObjectId, required: true },
});

const Note = mongoose.model<INote>("Note", NoteSchema);

export default Note;
