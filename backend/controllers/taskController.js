import Task from "../models/Task.js"; // Import Task model

// Create Task Controller
export const createTask = async (req, res) => {
  try {
    const { name, description, city, area, difficulty, status} = req.body;

    // Validate required fields
    if (!name || !city || !area || !difficulty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new task
    const newTask = new Task({
      name,
      description,
      city,
      area,
      difficulty,
      status
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
