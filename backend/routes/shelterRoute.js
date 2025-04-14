// import express from "express";
// import { isAdmin } from "../utils/authMiddleware.js";
// import {
//   createShelter,
//   deleteShelter,
//   getAllShelters,
//   getShelterById,
//   updateShelter,
//   countShelters,
//   getSheltersByLocation,
// } from "../controllers/shelterController.js";

// const router = express.Router();

// // Admin controller routes
// router.post("/create", isAdmin, createShelter);
// router.put("/:shelterId", isAdmin, updateShelter);
// router.delete("/:shelterId", isAdmin, deleteShelter);
// router.get("/count", isAdmin, countShelters);

// // common routes
// router.get("/", getAllShelters);
// router.get("/:shelterId", getShelterById);
// router.get("/location/:location", getSheltersByLocation);

// export default router;

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
  getSheltersFromCSV, // ✅ New import
} from "../controllers/shelterController.js";

const router = express.Router();

// Admin controller routes
router.post("/create", isAdmin, createShelter);
router.put("/:shelterId", isAdmin, updateShelter);
router.delete("/:shelterId", isAdmin, deleteShelter);
router.get("/count", isAdmin, countShelters);

// Common routes
router.get("/csv", getSheltersFromCSV); // ✅ New route to serve CSV-based shelters
router.get("/location/:location", getSheltersByLocation);
router.get("/", getAllShelters);
router.get("/:shelterId", getShelterById);

export default router;

