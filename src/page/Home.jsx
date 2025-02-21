import { useState } from "react";
import {
  DndContext,
  closestCorners,
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
import TaskForm from "./taskform/TaskForm";
import SortableTask from "../components/sortable/SortableTask";
import TaskColumn from "../components/taskcolumn/TaskColumn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient(); // Get the QueryClient instance
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
  } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/tasks/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return <span className="loading loading-infinity loading-lg"></span>;
  if (error)
    return <p className="text-center text-red-500">Error loading tasks</p>;

  // Group tasks by category
  const tasksByCategory = {
    "To-Do": [],
    "In-Progress": [],
    Done: [],
  };

  tasks.forEach((task) => {
    tasksByCategory[task.category]?.push(task);
  });

  // List of categories
  const categories = Object.keys(tasksByCategory);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task._id === active.id);

    if (!activeTask) return;

    const overId = over.id;

    // Determine the container (category) we are dragging over
    const overContainer = categories.includes(overId)
      ? overId
      : tasks.find((task) => task._id === overId)?.category;

    if (!overContainer) return;

    if (activeTask.category !== overContainer) {
      // Task moved to a different category

      const { _id, ...taskData } = activeTask;

      const updatedTask = {
        ...taskData,
        category: overContainer,
        order: tasksByCategory[overContainer].length + 1, // Place at the end
      };

      try {
        await axios.put(
          `http://localhost:5000/tasks/${activeTask._id}`,
          updatedTask
        );
        // Invalidate the query to refetch tasks
        queryClient.invalidateQueries(["tasks", user.email]);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    } else {
      // Reordering within the same category
      const categoryTasks = tasksByCategory[activeTask.category].sort(
        (a, b) => a.order - b.order
      );

      const oldIndex = categoryTasks.findIndex(
        (task) => task._id === active.id
      );
      const newIndex = categoryTasks.findIndex((task) => task._id === overId);

      if (oldIndex !== newIndex) {
        const newCategoryTasks = arrayMove(categoryTasks, oldIndex, newIndex);

        // Update the order of tasks
        const updatedTasksInCategory = newCategoryTasks.map((task, index) => ({
          ...task,
          order: index + 1,
        }));

        try {
          await axios.put("http://localhost:5000/tasks/reorder-tasks", {
            tasks: updatedTasksInCategory,
          });
          // Invalidate the query to refetch tasks
          queryClient.invalidateQueries(["tasks", user.email]);
        } catch (error) {
          console.error("Failed to reorder tasks:", error);
        }
      }
    }
  };

  return (
    <div className="text-center w-11/12 mx-auto">
      <h2 className="text-5xl pt-4 text-purple-400 font-bold">
        Task Management
      </h2>
      <TaskForm
        refetch={queryClient.invalidateQueries(["tasks", user?.email])}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-3 gap-2">
          {categories.map((category) => (
            <SortableContext
              key={category}
              id={category}
              items={tasksByCategory[category].map((task) => task._id)}
              strategy={verticalListSortingStrategy}
            >
              <TaskColumn id={category} title={category}>
                {tasksByCategory[category]
                  .sort((a, b) => a.order - b.order)
                  .map((task) => (
                    <SortableTask
                      key={task._id}
                      id={task._id}
                      task={task}
                      setEditingTask={setEditingTask}
                    />
                  ))}
              </TaskColumn>
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Home;
