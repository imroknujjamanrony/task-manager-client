import { FaCheckCircle, FaSpinner, FaTasks } from "react-icons/fa";

const TaskColumn = ({ title, children }) => {
  const iconMap = {
    "To-Do": { icon: <FaTasks />, color: "text-red-400" },
    "In-Progress": { icon: <FaSpinner />, color: "text-yellow-400" },
    Done: { icon: <FaCheckCircle />, color: "text-green-400" },
  };

  return (
    <section className="p-4 text-center border rounded-lg shadow-lg">
      <h2
        className={`text-3xl font-semibold flex items-center gap-2 ${iconMap[title]?.color}`}
      >
        {iconMap[title]?.icon} {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
};

export default TaskColumn;
