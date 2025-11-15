import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { Section } from "./Section";
import { User } from "./User";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description: string;

  @Column({ type: "varchar", default: "#3B82F6" })
  color: string;

  @Column({ type: "enum", enum: ["list", "board"], default: "list" })
  viewType: "list" | "board";

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  owner: User;

  @OneToMany(() => Task, (task) => task.project, {
    cascade: true,
    onDelete: "CASCADE",
  })
  tasks: Task[];

  @OneToMany(() => Section, (section) => section.project, {
    cascade: true,
    onDelete: "CASCADE",
  })
  sections: Section[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
