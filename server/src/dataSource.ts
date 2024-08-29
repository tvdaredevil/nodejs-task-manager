import { DataSource } from "typeorm";
import { Task } from "./models/Task";
import { User } from "./models/User";

export const appDataSource = new DataSource({
  name: "default",
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Task],
});
