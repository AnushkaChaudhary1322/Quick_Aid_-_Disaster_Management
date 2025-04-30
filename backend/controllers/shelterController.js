import Shelter from "../models/Shelter.js";
import { loadSheltersFromCSV } from "../utils/loadSheltersFromCSV.js";

// ➤ Create Shelter (Admin only)
export const createShelter = async (req, res) => {
  try {
    const newShelter = new Shelter(req.body);
    const savedShelter = await newShelter.save();
    res.status(201).json(savedShelter);
  } catch (error) {
    res.status(500).json({ message: "Error creating shelter", error });
  }
};

// ➤ Get All Shelters from MongoDB
export const getAllShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shelters", error });
  }
};

// ➤ Get Shelter by ID (MongoDB)
export const getShelterById = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.shelterId);
    if (!shelter) {
      return res.status(404).json({ message: "Shelter not found" });
    }
    res.json(shelter);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shelter", error });
  }
};

// ➤ Update Shelter (Admin only)
export const updateShelter = async (req, res) => {
  try {
    const updatedShelter = await Shelter.findByIdAndUpdate(
      req.params.shelterId,
      req.body,
      { new: true }
    );
    if (!updatedShelter) {
      return res.status(404).json({ message: "Shelter not found" });
    }
    res.json(updatedShelter);
  } catch (error) {
    res.status(500).json({ message: "Error updating shelter", error });
  }
};

// ➤ Delete Shelter (Admin only)
export const deleteShelter = async (req, res) => {
  try {
    const deletedShelter = await Shelter.findByIdAndDelete(req.params.shelterId);
    if (!deletedShelter) {
      return res.status(404).json({ message: "Shelter not found" });
    }
    res.json({ message: "Shelter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shelter", error });
  }
};

// ➤ Count Shelters (Admin only)
export const countShelters = async (req, res) => {
  try {
    const count = await Shelter.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error counting shelters", error });
  }
};

// ➤ Get Shelters by Location (MongoDB only)
export const getSheltersByLocation = async (req, res) => {
  try {
    const location = req.params.location;
    const shelters = await Shelter.find({ location: new RegExp(location, "i") });
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: "Error filtering shelters", error });
  }
};

// ✅ ➤ Combined: Get All Shelters (CSV + MongoDB) with pagination and location filter
export const getCombinedShelters = async (req, res) => {
  try {
    const csvShelters = await loadSheltersFromCSV();
    const mongoShelters = await Shelter.find();

    const allShelters = [...csvShelters, ...mongoShelters];

    // Optional location filter (case-insensitive)
    const { location, page = 1, limit = 10 } = req.query;

    let filteredShelters = allShelters;
    if (location) {
      const locationLower = location.toLowerCase();
      filteredShelters = allShelters.filter((shelter) =>
        shelter.location?.toLowerCase().includes(locationLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedShelters = filteredShelters.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      total: filteredShelters.length,
      page: Number(page),
      limit: Number(limit),
      data: paginatedShelters,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching combined shelters", error });
  }
};

// ✅ ➤ Get CSV Shelter by uniq_id (accessId)
export const getCsvShelterById = async (req, res) => {
  try {
    const { accessId } = req.params;
    const shelters = await loadSheltersFromCSV();

    const shelter = shelters.find((s) => s.accessId === accessId);

    if (!shelter) {
      return res.status(404).json({ message: "CSV shelter not found" });
    }

    const formattedShelter = {
      name: shelter.name,
      location: shelter.location,
      description: shelter.description,
      contact: {
        email: `${shelter.name.replace(/\s+/g, "").toLowerCase()}@gmail.com`,
        phone: "9876543210",
      },
      capacity: parseInt(shelter.capacity) || 0,
      availability: "available",
      address: shelter.address,
      photos: ["https://i.pinimg.com/736x/5e/38/e9/5e38e9534dd87fce952231a9f791335d.jpg"],
    };

    res.json(formattedShelter);
  } catch (error) {
    res.status(500).json({ message: "Error fetching CSV shelter", error });
  }
};
