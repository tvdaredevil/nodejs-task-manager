import { fetchWrapper } from "./fetchWrapper";
import { Task } from "../models/Task";

export async function updateTask(task: Task) {
  const res = await fetchWrapper(`/api/tasks/${task.id}`, {
    method: "PUT",
    body: JSON.stringify(task),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }

  const data = await res.json();

  return data as Task;
}
