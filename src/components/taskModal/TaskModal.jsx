import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

/* eslint-disable react/prop-types */
const TaskEditModal = ({ task, setEditingTask, refetch }) => {
  const [updatedTask, setUpdatedTask] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    category: task.category,
  });

  const handleChange = (e) => {
    setUpdatedTask({ ...updatedTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tasks/${task._id}`, updatedTask);
      Swal.fire("Updated!", "Task updated successfully!", "success");
      setEditingTask(null);
      refetch();
    } catch (error) {
      Swal.fire("Error!", "Failed to update task.", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={updatedTask.title}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <textarea
            name="description"
            value={updatedTask.description}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={updatedTask.dueDate}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <input
            type="text"
            name="category"
            value={updatedTask.category}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-2"
            required
          />
          <div className="flex justify-between">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingTask(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
