import { Router } from "express";
import { TaskController } from "../../controllers/TaskController";

const router = Router();

router.post("/tasks", TaskController.createTask);

router.put("/tasks/:taskId", TaskController.updateTask);

router.get("/tasks", TaskController.getTasks);

router.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

export default router;
