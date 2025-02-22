import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EditTaskForm = ({ task, setEditingTask, refetch }) => {
  const [updatedTask, setUpdatedTask] = useState(() => task || {});

  //   useEffect(() => {
  //     console.log("EditTaskForm mounted with task:", task);
  //     setUpdatedTask(task || {});
  //   }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { _id, ...taskData } = updatedTask;
      const response = await axios.put(
        `http://localhost:5000/tasks/${_id}`,
        taskData
      );
      console.log("Update response:", response.status, response.data);
      Swal.fire("Success!", "Task updated successfully.", "success");
      setEditingTask(null); // Close the edit form
      refetch(); // Refresh tasks
    } catch (error) {
      console.error("Error updating task:", error);
      console.error("Error response:", error.response);
      Swal.fire("Error!", "Failed to update task.", "error");
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  if (!task) {
    return null;
  }

  return (
    <form
      className="border p-4 rounded-lg shadow-lg bg-gray-800 text-white"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
      <div className="mb-4">
        <label className="block mb-1 text-left">Title:</label>
        <input
          type="text"
          name="title"
          value={updatedTask.title || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-left">Description:</label>
        <textarea
          name="description"
          value={updatedTask.description || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-left">Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={
            updatedTask.dueDate
              ? new Date(updatedTask.dueDate).toISOString().split("T")[0]
              : ""
          }
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-left">Category:</label>
        <select
          name="category"
          value={updatedTask.category || "To-Do"}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="To-Do">To-Do</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="flex justify-between">
        <button type="submit" className="btn btn-success">
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
