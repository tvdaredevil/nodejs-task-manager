import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Length, IsEmail } from "class-validator";
import { Task } from "./Task";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Task, (Task) => Task.user)
  Tasks: Task[];
}
