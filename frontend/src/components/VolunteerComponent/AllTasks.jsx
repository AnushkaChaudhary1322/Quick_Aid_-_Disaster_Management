import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "flowbite-react";
import { BASE_URL } from "../../api/apiservice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/volunteers/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        // ✅ Filter only "pending" tasks (tasks not yet taken)
        const availableTasks = data.tasks.filter((task) => task.status === "pending");
        setTasks(availableTasks);
      } else {
        console.error("Failed to fetch tasks:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/volunteers/tasks/${selectedTask._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        toast.success("Task deleted successfully!");
        fetchTasks();
      } else {
        toast.error("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Function to allow volunteers to take a task
  const handleTakeTask = async (taskId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/volunteers/tasks/take`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ volunteerId: localStorage.getItem("userId"), taskId }),
      });

      if (res.ok) {
        toast.success("Task taken successfully!");
        fetchTasks(); // Refresh task list
      } else {
        toast.error("Failed to take task.");
      }
    } catch (error) {
      console.error("Error taking task:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        color="primary"
        className="flex items-center mb-4"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="mr-2" /> Back
      </Button>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Tasks</h2>
        <Link to="/create-task">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition-all">
            Create Task
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-600">No available tasks at the moment.</p>
      ) : (
        <Table hoverable className="shadow-md rounded-lg overflow-hidden">
          <Table.Head className="bg-gray-100">
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {tasks.map((task) => (
              <Table.Row key={task._id} className="hover:bg-gray-50">
                <Table.Cell>{task.name}</Table.Cell>
                <Table.Cell>{task.description}</Table.Cell>
                <Table.Cell>{task.city}</Table.Cell>
                <Table.Cell>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold shadow-md 
                      ${task.status === "completed" ? "bg-green-500" 
                        : task.status === "in_progress" ? "bg-yellow-500" 
                        : "bg-red-500"}`}
                  >
                    {task.status.toUpperCase()}
                  </span>
                </Table.Cell>
                <Table.Cell className="flex space-x-3">
                  {/* Edit Button */}
                  <Link to={`/update-task/${task._id}`}>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full shadow-sm transition-all">
                      <FaEdit />
                    </button>
                  </Link>

                  {/* Delete Button */}
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full shadow-sm transition-all"
                    onClick={() => handleDeleteClick(task)}
                  >
                    <FaTrash />
                  </button>

                  {/* ✅ Take Task Button (Only for pending tasks) */}
                  {task.status === "pending" && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow-md transition-all"
                      onClick={() => handleTakeTask(task._id)}
                    >
                      Take Task
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup>
        <Modal.Header>Confirmation</Modal.Header>
        <Modal.Body>
          <p className="text-gray-800">
            Are you sure you want to delete the task{" "}
            <strong className="text-red-600">"{selectedTask?.name}"</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end space-x-3">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition-all"
            onClick={handleConfirmDelete}
          >
            Yes
          </Button>
          <Button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow-md transition-all"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllTasks;
