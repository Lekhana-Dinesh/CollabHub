import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getChatMessages, sendChatMessage } from "../controllers/chatController.js";

const router = express.Router();

// GET messages for a project
router.get("/projects/:projectId/chat", auth, getChatMessages);

// POST new message
router.post("/projects/:projectId/chat", auth, sendChatMessage);

export default router;
