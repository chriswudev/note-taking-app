import { Response } from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../src/controllers/noteController";
import Note, { INote } from "../src/models/Note";
import { RequestWithUser } from "../src/types";

jest.mock("../src/models/Note");

const mockRequest = { query: {} } as RequestWithUser;
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Note Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNote", () => {
    it("should create a new note", async () => {
      const saveSpy = jest
        .spyOn(Note.prototype, "save")
        .mockResolvedValueOnce({} as INote);

      mockRequest.body = {
        title: "Test Title",
        body: "Test Body",
        tags: ["tag1", "tag2"],
      };
      mockRequest["user"] = { _id: "user123" };
      const res = mockResponse();

      await createNote(mockRequest, res);

      expect(saveSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("getAllNotes", () => {
    it("should get all notes for the authenticated user", async () => {
      const findSpy = jest
        .spyOn(Note, "find")
        .mockResolvedValueOnce([{ title: "Note 1" }] as INote[]);

      mockRequest["user"] = { _id: "user123" };

      const res = mockResponse();
      await getAllNotes(mockRequest, res);

      expect(findSpy).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ title: "Note 1" }]);
    });
  });

  describe("getNoteById", () => {
    it("should get a specific note by ID for the authenticated user", async () => {
      const findOneSpy = jest
        .spyOn(Note, "findOne")
        .mockResolvedValueOnce({ title: "Note 1" } as INote);

      mockRequest.params = { id: "note123" };
      mockRequest["user"] = { _id: "user123" };

      const res = mockResponse();
      await getNoteById(mockRequest, res);

      expect(findOneSpy).toHaveBeenCalledWith({
        _id: "note123",
        userId: "user123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ title: "Note 1" });
    });
  });

  describe("updateNote", () => {
    it("should update a specific note by ID for the authenticated user", async () => {
      const findOneAndUpdateSpy = jest
        .spyOn(Note, "findOneAndUpdate")
        .mockResolvedValueOnce({ title: "Note 1" } as INote);

      mockRequest.params = { id: "note123" };
      mockRequest["user"] = { _id: "user123" };
      mockRequest.body = { title: "Updated Note" };

      const res = mockResponse();
      await updateNote(mockRequest, res);

      expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
        { _id: "note123", userId: "user123" },
        { title: "Updated Note" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ title: "Note 1" });
    });
  });

  describe("deleteNote", () => {
    it("should delete a specific note by ID for the authenticated user", async () => {
      const findOneAndDeleteSpy = jest
        .spyOn(Note, "findOneAndDelete")
        .mockResolvedValueOnce({ title: "Note 1" } as INote);

      mockRequest.params = { id: "note123" };
      mockRequest["user"] = { _id: "user123" };

      const res = mockResponse();
      await deleteNote(mockRequest, res);

      expect(findOneAndDeleteSpy).toHaveBeenCalledWith({
        _id: "note123",
        userId: "user123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ title: "Note 1" });
    });
  });
});
