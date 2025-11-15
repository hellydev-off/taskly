import "dotenv/config";
import "reflect-metadata";
import app from "./app";
import { initializeDatabase } from "./config/database";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Database: ${process.env.DB_NAME || "taskly_db"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
