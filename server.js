import express from "express";
import dotenv from "dotenv";
import jobsRoute from "./routes/jobs.js";
import { connectDB } from "./utils/db.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS (allow frontend running at 5173 to access backend at 5000)
const allowOrigin = process.env.ALLOW_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: allowOrigin }));

app.use(express.json({ limit: "1mb" }));

// Health check route
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "job-board-backend" });
});

// Jobs route
app.use("/api/jobs", jobsRoute);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
    process.exit(1);
  });
