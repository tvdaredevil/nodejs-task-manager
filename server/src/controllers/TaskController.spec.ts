import { Request, Response } from "express";
import { TaskController } from "./TaskController";
import { appDataSource } from "../dataSource";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { mock } from "jest-mock-extended";

jest.mock("../dataSource");

type UpdateTaskRequest = Request<{ taskId: string }, {}, Task>;

describe("TaskController", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>();
    res.locals = { userId: "1" };

    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
  });

  describe("createTask", () => {
    it("should return 404 if user is not found", async () => {
      const userRepository = {
        findOneBy: jest.fn().mockResolvedValue(null),
      };
      appDataSource.getRepository = jest.fn().mockReturnValue(userRepository);

      req.body = { title: "Test Task", content: "Test Content" };

      await TaskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ Task: "User not found" });
    });

    it("should create a task successfully", async () => {
      const user = new User();
      const userRepository = {
        findOneBy: jest.fn().mockResolvedValue(user),
      };

      const mockTaskInput = {
        title: "Test Task",
        content: "Test Content",
        user,
      };
      const mockTask = {
        id: 1,
        ...mockTaskInput,
      };
      const taskRepository = {
        create: jest.fn().mockReturnValue(mockTask),
        save: jest.fn().mockResolvedValue(mockTask),
      };
      appDataSource.getRepository = jest
        .fn()
        .mockImplementation((model) =>
          model === User ? userRepository : taskRepository
        );

      req.body = mockTaskInput;

      await TaskController.createTask(req, res);

      expect(taskRepository.create).toHaveBeenCalledWith(mockTaskInput);
      expect(taskRepository.save).toHaveBeenCalledWith(mockTask);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });
  });

  describe("getTasks", () => {
    it("should return tasks successfully", async () => {
      const tasks = [
        { id: 1, title: "Test Task", content: "Test Content", user: {} },
      ];
      const taskRepository = {
        find: jest.fn().mockResolvedValue(tasks),
      };
      appDataSource.getRepository = jest.fn().mockReturnValue(taskRepository);

      await TaskController.getTasks(req, res);

      expect(taskRepository.find).toHaveBeenCalledWith({ relations: ["user"] });
      expect(res.json).toHaveBeenCalledWith(tasks);
    });
  });

  describe("updateTask", () => {
    it("should return 404 if task is not found", async () => {
      const taskRepository = {
        findOneBy: jest.fn().mockResolvedValue(null),
      };
      appDataSource.getRepository = jest.fn().mockReturnValue(taskRepository);

      req.params = { taskId: "1" };
      req.body = { title: "Updated Task", content: "Updated Content" };

      await TaskController.updateTask(req as UpdateTaskRequest, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ Task: "Task not found" });
    });

    it("should update a task successfully", async () => {
      const task = new Task();
      const taskRepository = {
        findOneBy: jest.fn().mockResolvedValue(task),
        save: jest.fn().mockResolvedValue({
          id: 1,
          title: "Updated Task",
          content: "Updated Content",
        }),
      };
      appDataSource.getRepository = jest.fn().mockReturnValue(taskRepository);

      req.params = { taskId: "1" };
      req.body = { id: 1, title: "Updated Task", content: "Updated Content" };

      await TaskController.updateTask(req as UpdateTaskRequest, res);

      expect(taskRepository.save).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });
});
