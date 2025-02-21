/* eslint-disable react/prop-types */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "../taskcard/TaskCard";

const SortableTask = ({ id, task, setEditingTask, refetch }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} setEditingTask={setEditingTask} refetch={refetch} />
    </div>
  );
};

export default SortableTask;
