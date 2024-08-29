import { User } from "./User";

export interface Task {
  id: number;
  title: string;
  complete: boolean;
  content: string;
  timestamp: Date;
  user: User;
}

export type TaskInput = Pick<Task, "title" | "content">;
