import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Header from "../Header";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    expectedCompletion: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tasksByStatus, setTasksByStatus] = useState({
    "Not Started": [],
    "In Progress": [],
    "Completed": [],
    "Delayed": []
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("Not Started");
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://task-tracker-backend-eight.vercel.app/project/tasks/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasksByStatus(response.data.tasksByStatus);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleAddOrUpdateTask = async () => {
    if (!newTask.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(
          `https://task-tracker-backend-eight.vercel.app/project/updateTasks/${editingTaskId}`,
          {
            description: newTask.description,
            expectedCompletionTime: newTask.expectedCompletion,
            title: newTask.title,
            taskId: editingTaskId
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Task updated successfully!');
      } else {
        await axios.post(
          `https://task-tracker-backend-eight.vercel.app/project/addTask`,
          {
            projectId,
            title: newTask.title,
            description: newTask.description,
            expectedCompletion: newTask.expectedCompletion
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Task added successfully!');
      }
      setShowModal(false);
      setNewTask({ title: "", description: "", expectedCompletion: "" });
      setIsEditing(false);
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://task-tracker-backend-eight.vercel.app/project/updateTaskStatus`,
        { taskId, newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `https://task-tracker-backend-eight.vercel.app/project/delteTask/${taskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task');
      }
    }
  };

  const openEditModal = (task) => {
    const expectedCompletion = task.expectedCompletionTime 
      ? new Date(task.expectedCompletionTime).toISOString().slice(0, 16)
      : "";
    
    setNewTask({
      title: task.title,
      description: task.description,
      expectedCompletion: expectedCompletion
    });
    setIsEditing(true);
    setEditingTaskId(task._id);
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingTaskId(null);
    setNewTask({ title: "", description: "", expectedCompletion: "" });
    setError(null);
  };

  return (
    <>
      <Header />

      {/* Add Task Floating Button */}
      <button
        onClick={() => {
          setIsEditing(false);
          setNewTask({ title: "", description: "", expectedCompletion: "" });
          setShowModal(true);
        }}
        className="fixed bottom-20 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all z-50"
      >
        + {isEditing ? "Edit" : "Add"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600 mt-20">Loading tasks...</div>
      ) : (
        <>
          {/* Status Cards */}
          <div className="hidden md:grid px-4 grid-cols-2 md:grid-cols-4 gap-6 mt-6 mb-20">
            {Object.keys(tasksByStatus).map((status) => (
              <div
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`cursor-pointer bg-white shadow-md rounded-lg p-6 text-center transition-all ${
                  selectedStatus === status ? 'border-2 border-blue-500' : ''
                }`}
              >
                <h2 className="text-lg font-bold mb-2 text-gray-700">{status}</h2>
                <p className="text-3xl font-extrabold text-blue-600">
                  {tasksByStatus[status]?.length || 0}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile Status Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white flex justify-around shadow-lg z-40">
            {Object.keys(tasksByStatus).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex-1 py-3 text-center text-sm font-semibold ${
                  selectedStatus === status ? 'text-blue-600 border-t-2 border-blue-600' : 'text-gray-600'
                }`}
              >
                {status.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Tasks Table */}
          <div className="px-4 overflow-x-auto mt-4 mb-28">
            <h2 className="text-xl font-bold mb-4 text-gray-700">{selectedStatus} Tasks</h2>
            {tasksByStatus[selectedStatus]?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Due Date</th>
                      <th className="py-3 px-4 text-left">Update Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasksByStatus[selectedStatus].map((task) => (
                      <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">{task.title}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{task.description}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {task.expectedCompletionTime 
                            ? new Date(task.expectedCompletionTime).toLocaleDateString() 
                            : 'Not set'}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value=""
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          >
                            <option value="">Change Status</option>
                            {Object.keys(tasksByStatus)
                              .filter(s => s !== selectedStatus)
                              .map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 flex gap-3 items-center">
                          <button 
                            onClick={() => openEditModal(task)}
                            aria-label="Edit task"
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <FiEdit className="text-blue-600 hover:text-blue-800" size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task._id)}
                            aria-label="Delete task"
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <FiTrash2 className="text-red-600 hover:text-red-800" size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-6 bg-white rounded-lg shadow">
                No tasks in this status. Click the "+" button to add a new task.
              </div>
            )}
          </div>
        </>
      )}

      {/* Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              {isEditing ? "Edit Task" : "Add New Task"}
            </h2>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title *
              </label>
              <input
                id="title"
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="4"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                Due Date
              </label>
              <input
                id="dueDate"
                type="datetime-local"
                value={newTask.expectedCompletion}
                onChange={(e) => setNewTask({ ...newTask, expectedCompletion: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
              >
                {isEditing ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetails;
