import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import TaskForm from "./taskform/TaskForm";
import SortableTask from "../components/sortable/SortableTask";
import TaskColumn from "../components/taskcolumn/TaskColumn";

const Home = () => {
  const { user } = useAuth();
  const [editingTask, setEditingTask] = useState(null);

  // Define sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Fetch tasks using React Query
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
    enabled: !!user?.email,
  });

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    const overTask = tasks.find((task) => task._id === over.id);

    if (activeTask && overTask) {
      if (activeTask.category === overTask.category) {
        // Reorder tasks within the same category
        const categoryTasks = tasks
          .filter((task) => task.category === activeTask.category)
          .sort((a, b) => a.order - b.order);

        const oldIndex = categoryTasks.findIndex(
          (task) => task._id === active.id
        );
        const newIndex = categoryTasks.findIndex(
          (task) => task._id === over.id
        );

        const newCategoryTasks = arrayMove(categoryTasks, oldIndex, newIndex);

        const updatedTasks = newCategoryTasks.map((task, index) => ({
          ...task,
          order: index + 1,
        }));

        console.log("Updated Tasks for Reorder:", updatedTasks);

        // Send the updated tasks to the backend
        try {
          await axios.put("http://localhost:5000/tasks/reorder-tasks", {
            tasks: updatedTasks,
          });
          refetch(); // Refresh the task list
        } catch (error) {
          console.error("Failed to reorder tasks:", error);
        }
      } else {
        // Move task to a different category
        const updatedTask = {
          ...activeTask,
          category: overTask.category,
        };

        console.log("Updated Task for Move:", updatedTask);

        try {
          await axios.put(
            `http://localhost:5000/tasks/${activeTask._id}`,
            updatedTask
          );
          refetch();
        } catch (error) {
          console.error("Failed to update task:", error);
        }
      }
    }
  };

  if (isLoading)
    return <span className="loading loading-infinity loading-lg"></span>;
  if (error)
    return <p className="text-center text-red-500">Error loading tasks</p>;

  // Filter tasks into categories
  const todoTasks = tasks.filter((task) => task.category === "To-Do");
  const inProgressTasks = tasks.filter(
    (task) => task.category === "In-Progress"
  );
  const doneTasks = tasks.filter((task) => task.category === "Done");

  return (
    <div className="text-center w-11/12 mx-auto">
      <h2 className="text-5xl pt-4 text-purple-400 font-bold">
        Task Management
      </h2>
      <TaskForm refetch={refetch} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <main className="grid grid-cols-3 gap-2">
          {/* To-Do Column */}
          <SortableContext
            items={todoTasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn title="To-Do">
              {todoTasks.map((task) => (
                <SortableTask
                  key={task._id}
                  id={task._id}
                  task={task}
                  setEditingTask={setEditingTask}
                  refetch={refetch}
                />
              ))}
            </TaskColumn>
          </SortableContext>

          {/* In-Progress Column */}
          <SortableContext
            items={inProgressTasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn title="In-Progress">
              {inProgressTasks.map((task) => (
                <SortableTask
                  key={task._id}
                  id={task._id}
                  task={task}
                  setEditingTask={setEditingTask}
                  refetch={refetch}
                />
              ))}
            </TaskColumn>
          </SortableContext>

          {/* Done Column */}
          <SortableContext
            items={doneTasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn title="Done">
              {doneTasks.map((task) => (
                <SortableTask
                  key={task._id}
                  id={task._id}
                  task={task}
                  setEditingTask={setEditingTask}
                  refetch={refetch}
                />
              ))}
            </TaskColumn>
          </SortableContext>
        </main>
      </DndContext>
    </div>
  );
};

export default Home;
