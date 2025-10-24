import express from "express";
import { getTopProjects, getTopContributors } from "../controllers/leaderboardController.js";

const router = express.Router();

router.get("/projects", getTopProjects);
router.get("/contributors", getTopContributors);

export default router;
