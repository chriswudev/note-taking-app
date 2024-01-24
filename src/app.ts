import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
