import { Request, Response } from "express";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { appDataSource } from "../dataSource";

interface TaskInput {
  title: string;
  content: string;
}

export class TaskController {
  static async createTask(req: Request<{}, {}, TaskInput>, res: Response) {
    const { userId } = res.locals;
    const taskInput = req.body;

    const userRepository = appDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ Task: "User not found" });
    }

    const taskRepository = appDataSource.getRepository(Task);
    const task = taskRepository.create({ ...taskInput, user });

    await taskRepository.save(task);
    res.status(201).json(task);
  }

  static async getTasks(_: Request, res: Response) {
    const { userId } = res.locals;
    const taskRepository = appDataSource.getRepository(Task);
    const tasks = await taskRepository.find({
      relations: ["user"],
      where: { user: { id: parseInt(userId) } },
    });
    res.json(tasks);
  }

  static async updateTask(
    req: Request<{ taskId: string }, {}, Task>,
    res: Response
  ) {
    const updatedTask = req.body;
    const taskRepository = appDataSource.getRepository(Task);
    const task = await taskRepository.findOneBy({
      id: parseInt(req.params.taskId),
    });

    if (!task) {
      return res.status(404).json({ Task: "Task not found" });
    }

    await taskRepository.save(updatedTask);
    res.json(updatedTask);
  }
}
