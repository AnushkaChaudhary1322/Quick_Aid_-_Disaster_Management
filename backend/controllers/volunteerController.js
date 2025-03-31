import User from "../models/User.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

// Get all volunteers
export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).populate("assignedTasks");
    res.status(200).json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get volunteer by ID
export const getVolunteerById = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(volunteerId)) {
      return res.status(400).json({ message: "Invalid volunteerId" });
    }

    const volunteer = await User.findById(volunteerId).populate("assignedTasks");
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.status(200).json(volunteer);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get tasks assigned to a specific volunteer
export const getTasksByVolunteerId = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(volunteerId)) {
      return res.status(400).json({ message: "Invalid volunteerId" });
    }

    const user = await User.findById(volunteerId).populate("assignedTasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.assignedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific task by ID
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Volunteers can take a task (instead of admin assigning)
export const takeTask = async (req, res) => {
  try {
    const { volunteerId, taskId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(volunteerId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid volunteerId or taskId" });
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Ensure the task is not already taken
    if (task.assignedVolunteer) {
      return res.status(400).json({ message: "Task already taken" });
    }

    // Assign the task to the volunteer
    task.assignedVolunteer = volunteerId;
    task.status = "in_progress";
    await task.save();

    // Add task to the volunteer's assigned tasks
    await User.findByIdAndUpdate(volunteerId, { $addToSet: { assignedTasks: taskId } });

    res.status(200).json({ message: "Task taken successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Volunteers can complete a task and earn points based on difficulty
export const completeTask = async (req, res) => {
  try {
    const { taskId, volunteerId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(volunteerId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid volunteerId or taskId" });
    }

    // Fetch the task
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Ensure the task is assigned to this volunteer
    if (task.assignedVolunteer.toString() !== volunteerId) {
      return res.status(403).json({ message: "You are not assigned to this task" });
    }

    // Mark the task as completed
    task.status = "completed";
    await task.save();

    // Fetch the volunteer and update points
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    // Add points based on task difficulty
    let pointsEarned = task.points || 10; // Default to 10 if not set
    volunteer.points += pointsEarned;
    await volunteer.save();

    res.status(200).json({ message: `Task completed! You earned ${pointsEarned} points.`, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a task (Admin can change details)
export const updateTask = async (req, res) => {
  try {
    const { updateId } = req.params;
    const { name, description, status, city, area } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      updateId,
      { name, description, status, city, area },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
