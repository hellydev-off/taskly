import express from "express";
import cors from "cors";
import routes from "./routes";
import authRoutes from "./routes/authRoutes";
import { AppDataSource } from "./config/database";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);

app.use("/api", authMiddleware, routes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

export default app;
