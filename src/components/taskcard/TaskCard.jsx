// import { FaTrash, FaEdit } from "react-icons/fa";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import axios from "axios";

// const MySwal = withReactContent(Swal);

// const TaskCard = ({ task, setEditingTask, refetch }) => {
//   const { _id, title, description, dueDate, category } = task;

//   // Handle Delete Functionality
//   const handleDelete = async (e) => {
//     e.stopPropagation();
//     MySwal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(
//             `https://task-management-server-nu-six.vercel.app/tasks/${_id}`
//           );
//           MySwal.fire("Deleted!", "Your task has been deleted.", "success");
//           refetch(); // Refresh task list
//         } catch (error) {
//           MySwal.fire("Error!", "Failed to delete task.", "error");
//         }
//       }
//     });
//   };

//   // Handle Edit Functionality
//   const handleEdit = (e) => {
//     e.stopPropagation();
//     // console.log("Edit button clicked", task);
//     setEditingTask(task);
//   };

//   return (
//     <div className="border p-4 rounded-lg shadow-lg bg-gray-800 text-white">
//       <h3 className="text-2xl font-bold mb-2">{title}</h3>
//       <p className="text-gray-300">{description}</p>
//       <p className="text-yellow-300">Due: {new Date(dueDate).toDateString()}</p>
//       <p className="text-green-400 bg-yellow-600 rounded-md">
//         Category: {category}
//       </p>

//       <div className="flex justify-between mt-4">
//         <button
//           className="btn btn-sm btn-warning flex items-center"
//           onClick={handleEdit}
//           onPointerDown={(e) => e.stopPropagation()}
//         >
//           <FaEdit className="mr-1" /> Edit
//         </button>
//         <button
//           className="btn btn-sm btn-error flex items-center"
//           onClick={handleDelete}
//           onPointerDown={(e) => e.stopPropagation()}
//         >
//           <FaTrash className="mr-1" /> Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskCard;

import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const MySwal = withReactContent(Swal);

const TaskCard = ({ task, setEditingTask, refetch }) => {
  const { _id, title, description, dueDate, category } = task;

  // Handle Delete Functionality
  const handleDelete = async (e) => {
    e.stopPropagation();
    MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://task-management-server-nu-six.vercel.app/tasks/${_id}`
          );
          MySwal.fire("Deleted!", "Your task has been deleted.", "success");
          refetch(); // Refresh task list
        } catch (error) {
          MySwal.fire("Error!", "Failed to delete task.", "error");
        }
      }
    });
  };

  // Handle Edit Functionality
  const handleEdit = (e) => {
    e.stopPropagation();
    setEditingTask(task);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 p-5 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl text-white">
      <h3 className="text-2xl font-bold mb-3 text-blue-400">{title}</h3>
      <p className="text-gray-300 mb-2">{description}</p>
      <p className="text-yellow-400 font-semibold">
        Due: {new Date(dueDate).toLocaleDateString()}
      </p>

      {/* Category Badge */}
      <span className="inline-block mt-3 px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded-full">
        {category}
      </span>

      {/* Buttons */}
      <div className="flex justify-between mt-5">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 transition-colors text-black font-semibold"
          onClick={handleEdit}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaEdit /> Edit
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold"
          onClick={handleDelete}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
