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
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskForm from "./taskform/TaskForm";
import SortableTask from "../components/sortable/SortableTask";
import TaskColumn from "../components/taskcolumn/TaskColumn";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";

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

    if (over && active.id !== over.id) {
      const movedTask = tasks.find((task) => task._id === active.id);
      const overTask = tasks.find((task) => task._id === over.id);

      if (movedTask && overTask) {
        const newCategory = overTask.category;

        const { _id, ...updatedTask } = {
          ...movedTask,
          category: newCategory,
        };

        try {
          await axios.put(
            `http://localhost:5000/tasks/${movedTask._id}`,
            updatedTask
          );
          refetch();
        } catch (error) {
          console.error(
            "Failed to update task:",
            error.response?.data || error.message
          );
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
          <SortableContext
            items={todoTasks}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn title="To-Do">
              {todoTasks.map((task) => (
                <SortableTask
                  key={task._id}
                  task={task}
                  setEditingTask={setEditingTask}
                  refetch={refetch}
                />
              ))}
            </TaskColumn>
          </SortableContext>

          <SortableContext
            items={inProgressTasks}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn title="In-Progress">
              {inProgressTasks.map((task) => (
                <SortableTask
                  key={task._id}
                  task={task}
                  setEditingTask={setEditingTask}
                  refetch={refetch}
                />
              ))}
            </TaskColumn>
          </SortableContext>

          <SortableContext
            items={doneTasks}
            strategy={verticalListSortingStrategy}
          >
            <TaskColumn title="Done">
              {doneTasks.map((task) => (
                <SortableTask
                  key={task._id}
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
