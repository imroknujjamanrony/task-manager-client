import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const TaskForm = ({ refetch }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

  const handleSubmit = async () => {
    if (!title.trim()) {
      Swal.fire("Error", "Task title is required!", "error");
      return;
    }
    if (!category.trim()) {
      Swal.fire("Error", "Task category is required!", "error");
      return;
    }

    const userData = { name: user?.displayName, email: user?.email };
    const newTask = {
      title,
      description,
      category,
      dueDate,
      userData,
      order: 0, // Default order (will be updated by the backend)
    };

    try {
      await axios.post("http://localhost:5000/tasks", newTask);
      Swal.fire("Success", "Task added successfully!", "success");

      // Reset input fields
      setTitle("");
      setDescription("");
      setCategory("");
      setDueDate(new Date());
      setIsModalOpen(false);

      refetch(); // Refresh task list
    } catch (error) {
      Swal.fire("Error", "Failed to add task!", "error");
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="p-6">
      <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
        Add Task
      </button>
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              className="input input-bordered w-full mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Task Description"
              className="textarea textarea-bordered w-full mb-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="select select-bordered w-full mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="To-Do">To-Do</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Done">Done</option>
            </select>
            <label className="block font-semibold mb-2">Due Date:</label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="input input-bordered w-full"
            />
            <div className="modal-action">
              <button className="btn btn-success" onClick={handleSubmit}>
                Submit
              </button>
              <button
                className="btn btn-error"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default TaskForm;
