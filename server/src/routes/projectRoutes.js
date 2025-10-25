import express from "express";
import auth from "../middleware/authMiddleware.js";
import { uploadProjectCover } from "../config/cloudinary.js";
import {
  createProject,
  getProjects,
  getProjectById,
  requestJoin,
  acceptJoinRequest,
  rejectJoinRequest,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// list & create
router.get("/", getProjects);
router.post("/", auth, uploadProjectCover.single('coverImage'), createProject);


// single project
router.get("/:id", getProjectById);
router.delete("/:id", auth, deleteProject);

// join flow
router.post("/:id/join", auth, requestJoin);
router.post("/:id/request", auth, requestJoin);
router.post("/:projectId/requests/:requestId/accept", auth, acceptJoinRequest);
router.post("/:projectId/requests/:requestId/reject", auth, rejectJoinRequest);

export default router;
