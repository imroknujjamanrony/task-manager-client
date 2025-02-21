import SortableTask from "../sortable/SortableTask";
import { useState } from "react";

const Task = ({ task }) => {
  const [editingTask, setEditingTask] = useState(null);
  console.log("Task Data:", task);

  return (
    <div>
      <SortableTask task={task} setEditingTask={setEditingTask} />
      {editingTask && (
        <SortableTask task={editingTask} setEditingTask={setEditingTask} />
      )}
    </div>
  );
};

export default Task;
