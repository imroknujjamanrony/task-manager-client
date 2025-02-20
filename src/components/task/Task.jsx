// /* eslint-disable react/prop-types */
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import TaskCard from "../taskcard/TaskCard";
// import useAuth from "../../hooks/useAuth";

// const Task = () => {
//   const { user } = useAuth(); // Get user email from auth context

//   const {
//     data: tasks = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["tasks", user?.email],
//     queryFn: async () => {
//       const res = await axios.get(`http://localhost:5000/tasks/${user?.email}`);
//       return res.data;
//     },
//     enabled: !!user?.email, // Ensures it only runs if email exists
//   });

//   if (isLoading)
//     return <span className="loading loading-infinity loading-lg"></span>;
//   if (error)
//     return <p className="text-center text-red-500">Error loading tasks</p>;
//   console.log(tasks);

//   return (
//     <div className=" p-6">
//       {tasks.length > 0 ? (
//         tasks.map((task) => (
//           <TaskCard className="" key={task._id} task={task} />
//         ))
//       ) : (
//         <p className="col-span-3 text-center text-gray-400">No tasks found</p>
//       )}
//     </div>
//   );
// };

// export default Task;

/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import TaskCard from "../taskcard/TaskCard";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import TaskEditModal from "../taskModal/TaskModal";

const Task = () => {
  const { user } = useAuth(); // Get user email from auth context
  const [editingTask, setEditingTask] = useState(null);

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/tasks/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email, // Ensures it only runs if email exists
  });

  if (isLoading)
    return <span className="loading loading-infinity loading-lg"></span>;
  if (error)
    return <p className="text-center text-red-500">Error loading tasks</p>;

  return (
    <div className="p-6">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            setEditingTask={setEditingTask}
            refetch={refetch}
          />
        ))
      ) : (
        <p className="col-span-3 text-center text-gray-400">No tasks found</p>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          setEditingTask={setEditingTask}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default Task;
