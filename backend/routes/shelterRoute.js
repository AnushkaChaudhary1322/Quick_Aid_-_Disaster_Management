import express from "express";
import { isAdmin } from "../utils/authMiddleware.js";
import {
  createShelter,
  deleteShelter,
  getAllShelters,
  getShelterById,
  updateShelter,
  countShelters,
  getSheltersByLocation,
  getCombinedShelters,
  getCsvShelterById, // ✅ New CSV single shelter route
} from "../controllers/shelterController.js";

const router = express.Router();

// Admin routes (MongoDB shelters)
router.post("/create", isAdmin, createShelter);
router.put("/:shelterId", isAdmin, updateShelter);
router.delete("/:shelterId", isAdmin, deleteShelter);
router.get("/count", isAdmin, countShelters);

// Public routes
router.get("/combined", getCombinedShelters); // ✅ MongoDB + CSV shelters
router.get("/location/:location", getSheltersByLocation);
router.get("/csv/:accessId", getCsvShelterById); // ✅ New route for CSV shelter by uniq_id
router.get("/", getAllShelters); // MongoDB only
router.get("/:shelterId", getShelterById); // MongoDB by ObjectId

export default router;
