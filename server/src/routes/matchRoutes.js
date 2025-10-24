import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getSuggestedProjects } from "../controllers/matchController.js";

const router = express.Router();

router.get("/suggested", auth, getSuggestedProjects);

export default router;
