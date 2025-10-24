import express from "express";
import { getMe, updateProfile, listUsers, getUserById } from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);
router.get("/", listUsers);
router.get("/:id", getUserById);

export default router;
