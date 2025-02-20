import { FaTasks, FaSpinner, FaCheckCircle } from "react-icons/fa";

const TaskColumn = ({ title }) => {
  // Map titles to relevant icons and colors
  const iconMap = {
    "TO-DO": { icon: <FaTasks />, color: "text-red-400" },
    INPROGRESS: { icon: <FaSpinner />, color: "text-yellow-400" },
    DONE: { icon: <FaCheckCircle />, color: "text-green-400" },
  };

  return (
    <section className="p-4 text-center border rounded-lg shadow-lg ">
      <h2
        className={`text-3xl font-semibold flex items-center gap-2 ${iconMap[title]?.color}`}
      >
        {iconMap[title]?.icon} {title}
      </h2>
    </section>
  );
};

export default TaskColumn;
