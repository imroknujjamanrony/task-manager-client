import Task from "../components/task/Task";
import TaskColumn from "../components/taskcolumn/TaskColumn";
import TaskForm from "./taskform/TaskForm";

const Home = () => {
  return (
    <div className="text-center w-11/12 mx-auto ">
      <h2 className="text-5xl pt-4 text-purple-400 font-bold">
        Task Management
      </h2>
      <TaskForm></TaskForm>
      <main className="grid grid-cols-3 gap-2 ">
        {/* section-1 */}
        <div>
          <TaskColumn title="TO-DO"></TaskColumn>
          <div className="">
            <Task></Task>
          </div>
        </div>
        {/* section-2 */}

        <div>
          <TaskColumn title="INPROGRESS"></TaskColumn>
        </div>
        {/* section-3 */}

        <div>
          <TaskColumn title="DONE"></TaskColumn>
        </div>
      </main>
    </div>
  );
};

export default Home;
