import { useState, useMemo } from "react";
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
import Modal from "react-modal"; // Import Modal for displaying EditTaskForm
import EditTaskForm from "../components/EditTaskForm";

Modal.setAppElement("#root"); // Set the app root element for accessibility

const Home = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userEmail = user?.email;
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
    queryKey: ["tasks", userEmail],
    queryFn: async () => {
      const res = await axios.get(
        `https://task-management-server-nu-six.vercel.app/tasks/${userEmail}`
      );
      return res.data;
    },
    enabled: !!userEmail,
  });

  // Group tasks by category using useMemo
  const tasksByCategory = useMemo(() => {
    return {
      "To-Do": tasks.filter((task) => task.category === "To-Do"),
      "In-Progress": tasks.filter((task) => task.category === "In-Progress"),
      Done: tasks.filter((task) => task.category === "Done"),
    };
  }, [tasks]);

  // List of categories
  const categories = Object.keys(tasksByCategory);

  // Handle drag and drop events
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
        order: tasksByCategory[overContainer]?.length + 1 || 1,
      };

      // Optimistically update tasks in the cache
      queryClient.setQueryData(["tasks", userEmail], (oldTasks = []) => {
        return oldTasks.map((task) =>
          task._id === activeTask._id ? { ...task, ...updatedTask } : task
        );
      });

      try {
        await axios.put(
          `https://task-management-server-nu-six.vercel.app/tasks/${activeTask._id}`,
          updatedTask
        );
      } catch (error) {
        console.error("Failed to update task:", error);
        // Rollback on error
        queryClient.invalidateQueries(["tasks", userEmail]);
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

        // Optimistically update tasks in the cache
        queryClient.setQueryData(["tasks", userEmail], (oldTasks = []) => {
          const otherTasks = oldTasks.filter(
            (task) => task.category !== activeTask.category
          );
          return [...otherTasks, ...updatedTasksInCategory];
        });

        try {
          await axios.put(
            "https://task-management-server-nu-six.vercel.app/tasks/reorder-tasks",
            {
              tasks: updatedTasksInCategory,
            }
          );
        } catch (error) {
          console.error("Failed to reorder tasks:", error);
          // Rollback on error
          queryClient.invalidateQueries(["tasks", userEmail]);
        }
      }
    }
  };
  // Place conditional returns after hooks
  if (!userEmail) {
    return <p>Loading user information...</p>;
  }

  if (isLoading)
    return <span className="loading loading-infinity loading-lg"></span>;
  if (error)
    return <p className="text-center text-red-500">Error loading tasks</p>;

  return (
    <div className="text-center w-11/12 mx-auto">
      <h2 className="text-5xl pt-4 text-purple-400 font-bold">
        Task Management
      </h2>
      <TaskForm refetch={refetch} />

      {/* Render EditTaskForm inside a Modal */}
      <Modal
        isOpen={!!editingTask}
        onRequestClose={() => setEditingTask(null)}
        contentLabel="Edit Task"
        className="Modal"
        overlayClassName="Overlay"
      >
        {editingTask && (
          <EditTaskForm
            task={editingTask}
            setEditingTask={setEditingTask}
            refetch={refetch}
          />
        )}
      </Modal>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                      refetch={refetch}
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
