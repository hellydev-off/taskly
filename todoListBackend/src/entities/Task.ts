import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./Project";
import { Section } from "./Section";
import { User } from "./User";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "varchar", length: 2000, nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ["в_процессе", "завершено"],
    default: "в_процессе",
  })
  status: "в_процессе" | "завершено";

  @Column({ type: "enum", enum: ["low", "medium", "high"], default: "medium" })
  priority: "low" | "medium" | "high";

  @Column({ type: "date", nullable: true })
  dueDate: Date | null;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: Project;

  @ManyToOne(() => Section, (section) => section.tasks, {
    nullable: true,
    onDelete: "SET NULL",
  })
  section: Section | null;

  @Column("text", { array: true, default: [] })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  completedAt: Date | null;
}
