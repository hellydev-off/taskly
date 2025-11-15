import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";

@Entity("sections")
export class Section {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", default: "#6B7280" })
  color: string;

  @Column({ type: "integer", default: 0 })
  order: number;

  @ManyToOne(() => Project, (project) => project.sections, {
    onDelete: "CASCADE",
  })
  project: Project;

  @OneToMany(() => Task, (task) => task.section, {
    cascade: true,
    onDelete: "SET NULL",
  })
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
