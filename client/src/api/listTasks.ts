import { Task } from "../models/Task";
import { fetchWrapper } from "./fetchWrapper";

export async function listTasks() {
  const res = await fetchWrapper("/api/tasks");
  const data = await res.json();
  return data as Task[];
}
