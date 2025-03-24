// import express from "express";
// import { isAdmin } from "../utils/authMiddleware.js";
// import {
//   assignTaskToVolunteer,
//   completeTask,
//   creatTask,
//   deleteTask,
//   getAllTasks,
//   getAllVolunteers,
//   getTaskById,
//   getTasksByVolunteerId,
//   updateTask,
// } from "../controllers/volunteerController.js";
// const router = express.Router();

// router.get("/", getAllVolunteers);

// router.post("/createtask", creatTask);
// router.get("/tasks", getAllTasks);
// router.post("/tasks/assign", assignTaskToVolunteer);
// router.get("/tasks/:volunteerId", getTasksByVolunteerId);
// router.get("/task/:taskId", getTaskById);
// router.put("/tasks/:updateId", updateTask);
// router.delete("/tasks/:taskId", isAdmin, deleteTask);
// router.put("/tasks/:taskId/complete", completeTask);

// export default router;


import express from "express";
import { isAdmin } from "../utils/authMiddleware.js";
import {
  takeTask, // ✅ New function for volunteers to take tasks
  completeTask,
  // creatTask,
  deleteTask,
  getAllTasks,
  getAllVolunteers,
  getTaskById,
  getTasksByVolunteerId,
  updateTask,
} from "../controllers/volunteerController.js";

const router = express.Router();

router.get("/", getAllVolunteers);

// router.post("/createtask", creatTask);
router.get("/tasks", getAllTasks);
router.post("/tasks/take", takeTask);

router.get("/tasks/:volunteerId", getTasksByVolunteerId);
router.get("/task/:taskId", getTaskById);
router.put("/tasks/:updateId", updateTask);
router.delete("/tasks/:taskId", isAdmin, deleteTask);
router.put("/tasks/:taskId/complete", completeTask);

export default router;
