import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// create a task
router.post("/tasks", auth, createTask);

// update a task
router.patch("/tasks/:id", auth, updateTask);

// delete a task (not used by frontend yet but fine to keep)
router.delete("/tasks/:id", auth, deleteTask);

// get tasks for a project
router.get("/projects/:projectId/tasks", auth, getTasksByProject);

export default router;
