import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../api/apiservice";
import { Button, Modal } from "flowbite-react";
import { FaCoins } from "react-icons/fa";

const ShowTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showCompletionNotification, setShowCompletionNotification] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser.user._id;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/volunteers/tasks`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks);
          setLoading(false);
        } else {
          console.error("Failed to fetch tasks:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    fetchTasks();
  }, []);

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
        const updatedTasks = tasks.map(task =>
          task._id === taskId ? { ...task, assignedVolunteer: userId, status: "in_progress" } : task
        );
        setTasks(updatedTasks);
      } else {
        console.error("Failed to take task:", res.statusText);
      }
    } catch (error) {
      console.error("Error taking task:", error.message);
    }
  };

  const handleCompleteTask = (taskId, points) => {
    setSelectedTaskId(taskId);
    setPointsEarned(points);
    setShowModal(true);
  };

  const handleConfirmCompletion = async (confirmed) => {
    if (confirmed && selectedTaskId) {
      try {
        const res = await fetch(
          `${BASE_URL}/api/volunteers/tasks/${selectedTaskId}/complete`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ volunteerId: userId }), 
          }
        );

        if (res.ok) {
          const updatedTasks = tasks.map(task =>
            task._id === selectedTaskId ? { ...task, status: "completed" } : task
          );
          setTasks(updatedTasks);
          setShowCompletionNotification(true);

          setTimeout(() => {
            setShowCompletionNotification(false);
          }, 5000);
        } else {
          console.error("Failed to complete task:", res.statusText);
        }

        setShowModal(false);
      } catch (error) {
        console.error("Error completing task:", error.message);
      }
    } else {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="flex-grow p-6 min-h-screen bg-white">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Available Tasks</h1>

        {loading ? (
          <p className="text-center text-lg text-gray-600">Loading task details...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No available tasks at the moment.</p>
        ) : (
          <div className="w-full">
            {/* Task List as a Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Task Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Difficulty</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task._id} className={`border ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                      <td className="px-4 py-3 text-gray-700">{task.name}</td>
                      <td className="px-4 py-3 text-gray-600">{task.description}</td>
                      
                      {/* Styled Difficulty Label */}
                      <td className="px-4 py-3">
                        <span 
                          className={`px-3 py-1 rounded-full text-white text-xs font-semibold shadow-md ${
                            task.difficulty === "hard" ? "bg-red-500" 
                            : task.difficulty === "medium" ? "bg-yellow-500" 
                            : "bg-blue-500"
                          }`}
                        >
                          {task.difficulty.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-700">{task.area}</td>

                      {/* Status Indicator */}
                      <td className={`px-4 py-3 font-semibold ${
                          task.status === "pending" ? "text-red-500" 
                          : task.status === "in_progress" ? "text-yellow-500" 
                          : "text-green-500"
                        }`}
                      >
                        {task.status.toUpperCase()}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 text-center">
                        {task.status === "completed" ? (
                          <Button className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md">
                            Completed
                          </Button>
                        ) : task.assignedVolunteer === userId ? (
                          <Button
                            onClick={() => handleCompleteTask(task._id, task.points)}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded-md"
                          >
                            Complete
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleTakeTask(task._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md"
                          >
                            Take Task
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Completing a Task */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header>Complete Task</Modal.Header>
        <Modal.Body>Are you sure you want to mark this task as completed?</Modal.Body>
        <Modal.Footer>
          <Button color="success" onClick={() => handleConfirmCompletion(true)}>Yes</Button>
          <Button color="danger" onClick={() => handleConfirmCompletion(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShowTask;
