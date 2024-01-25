import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { register, login } from "../src/controllers/authController";
import User, { IUser } from "../src/models/User";

jest.mock("../src/models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockRequest = {} as Request;
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const saveSpy = jest
        .spyOn(User.prototype, "save")
        .mockResolvedValueOnce({} as IUser);

      mockRequest.body = { username: "testuser", password: "testpassword" };

      const res = mockResponse();
      await register(mockRequest, res);

      expect(saveSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should log in an existing user with correct credentials", async () => {
      const findOneSpy = jest.spyOn(User, "findOne").mockResolvedValueOnce({
        username: "testuser",
        password: "hashedpassword",
      } as IUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);
      jest
        .spyOn(jwt, "sign")
        .mockReturnValueOnce("mockedtoken" as never as void);

      mockRequest.body = { username: "testuser", password: "testpassword" };

      const res = mockResponse();
      await login(mockRequest, res);

      expect(findOneSpy).toHaveBeenCalledWith({ username: "testuser" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "mockedtoken" });
    });
  });
});
