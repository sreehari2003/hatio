import { useTodo } from "@app/hooks/api";
import { Loader } from "@app/components/Todo/Loader";
import { CreateOrEditModal } from "@app/components/project/NewProject";
import { useToggle } from "@app/hooks/useToggle";
import { Task } from "@app/components/Todo/Task";
import { NewTask } from "@app/components/Todo/NewTask";
import { toast } from "sonner";
import { apiHandler } from "@app/config/apiHandler";
import { useRouter } from "next/router";

const TodoPage = () => {
  const { isLoading, data, getAllTodo } = useTodo();
  const [isOpen, toggleOpen] = useToggle();
  const [isTaskOpen, toggleNewTask] = useToggle();
  const router = useRouter();
  const { id } = router.query;

  const deleteProject = async () => {
    try {
      await apiHandler.delete(`/projects/${id}`);
      toast.success("Project deleted successfully");
      router.push("/");
    } catch {
      toast.error("Error deleting project");
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6">
      <CreateOrEditModal
        isOpen={isOpen}
        onToggle={toggleOpen.off}
        type="Edit"
        callBack={getAllTodo}
        projectName={data?.title}
      />
      <nav className="flex justify-between sticky top-0 bg-white pt-2">
        <h1 className="text-3xl">{data?.title}</h1>
        <div className="flex gap-2">
          <button
            className="py-1 px-3 border-blue-600  border-2 rounded-md text-blue-600"
            onClick={toggleOpen.on}
          >
            Edit
          </button>
          <button
            className="py-1 px-3 border-red-600  border-2 rounded-md text-red-600"
            onClick={deleteProject}
          >
            Delete
          </button>
          <button
            className="py-1 px-3 border-black  border-2 rounded-md text-black"
            onClick={() => {}}
          >
            Export
          </button>
        </div>
      </nav>
      <main className="flex justify-center mt-5 flex-col items-center">
        <h2 className="text-2xl font-bold mb-5">All Todos</h2>
        <div className="flex flex-col gap-3">
          {new Array(15).fill(0).map((el) => (
            <Task
              key={1}
              title="hello"
              getTodo={getAllTodo}
              id={"1"}
              description={"dbewjgrjhgrjetgjre"}
            />
          ))}
          <button
            className="px-3 py-3 border-2 border-blue-500 rounded-md hover:border-blue-300"
            onClick={toggleNewTask.on}
          >
            New task
          </button>

          <NewTask isOpen={isTaskOpen} onToggle={toggleNewTask.off} />
        </div>
      </main>
    </div>
  );
};

export default TodoPage;
