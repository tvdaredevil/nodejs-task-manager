import { Task, TaskInput } from "../models/Task";
import { fetchWrapper } from "./fetchWrapper";

export async function createTask(task: TaskInput) {
  const res = await fetchWrapper("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  const data = await res.json();

  return data as Task;
}
