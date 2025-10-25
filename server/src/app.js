import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// FIXED CORS - Allow both dev ports
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/match", matchRoutes);
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("CollabHub API is running...");
});

export default app;