import "reflect-metadata";
import { DataSource } from "typeorm";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";
import { Section } from "../entities/Section";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "taskly_db",

  synchronize: true,
  logging: true,

  entities: [Project, Task, Section, User],
  migrations: [],
  subscribers: [],

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");
    return AppDataSource;
  } catch (error) {
    console.error("❌ Error during database connection:", error);
    throw error;
  }
}
