import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app, { server } from "../src/app";

const mockUser = {
  username: "testuser",
  password: "testpassword",
};

let noteId: string;

const mockNote = {
  title: "Test Note",
  body: "This is a test note.",
  tags: ["tag1", "tag2"],
};

const loginAndGetToken = async () => {
  const response = await request(app)
    .post("/auth/login")
    .send({ username: mockUser.username, password: mockUser.password });

  return response.body.token;
};

let mongoServer: MongoMemoryServer;

describe("API Integration Tests", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Override Mongoose's default promise library
    mongoose.Promise = global.Promise;

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Disconnect Mongoose from the in-memory database
    await mongoose.disconnect();
    // Stop the in-memory database server
    await mongoServer.stop();
    server.close();
  });

  beforeEach(async () => {
    // Clear the database and add a test user
    await mongoose.connection.db.dropDatabase();
    await request(app).post("/auth/register").send(mockUser);

    const token = await loginAndGetToken();

    const noteResponse = await request(app)
      .post("/notes")
      .set("Authorization", `Bearer ${token}`)
      .send(mockNote);

    noteId = noteResponse.body._id;
  });

  describe("User Authentication Endpoints", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/auth/register").send({
        username: "newuser",
        password: "newpassword",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message");
    });

    it("should log in an existing user", async () => {
      const response = await request(app).post("/auth/login").send({
        username: mockUser.username,
        password: mockUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("Note Endpoints", () => {
    it("should get all notes for the authenticated user", async () => {
      const token = await loginAndGetToken();

      const response = await request(app)
        .get("/notes")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe(mockNote.title);
    });

    it("should get a specific note by ID for the authenticated user", async () => {
      const token = await loginAndGetToken();

      const response = await request(app)
        .get(`/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(mockNote.title);
    });

    it("should update a specific note by ID for the authenticated user", async () => {
      const token = await loginAndGetToken();

      const updatedNote = {
        title: "Updated Note",
        body: "Updated body",
        tags: ["tag3"],
      };

      const response = await request(app)
        .put(`/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedNote);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedNote.title);
    });

    it("should delete a specific note by ID for the authenticated user", async () => {
      const token = await loginAndGetToken();

      const response = await request(app)
        .delete(`/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(mockNote.title);

      const getNoteResponse = await request(app)
        .get(`/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(getNoteResponse.status).toBe(404);
    });
  });
});
