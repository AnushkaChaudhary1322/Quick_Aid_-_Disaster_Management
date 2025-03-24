import express from "express";
import {
  forgotPassword,
  getTotalUsers,
  getUserById,
  resetPassword,
  signOut,
  updateUser,
  updateUserRole,
} from "../controllers/userController.js";
import { createTask } from "../controllers/taskController.js";
import { verifyToken } from "../utils/authUtils.js";

const router = express.Router();

router.get("/get/:id", getUserById);
router.put("/update/:userId", verifyToken, updateUser);
router.post("/signout", signOut);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.get("/getall", getTotalUsers);
router.put("/updaterole", updateUserRole);
// Update Volunteer Points
router.post("/createtask", createTask);
router.put("/update-points/:userId", verifyToken, updateUser);
export default router;
