import { useTodo } from "@app/hooks/api";
import { Loader } from "@app/components/Todo/Loader";
import { CreateOrEditModal } from "@app/components/project/NewProject";
import { useToggle } from "@app/hooks/useToggle";
import { Task } from "@app/components/Todo/Task";
import { NewTask } from "@app/components/Todo/NewTask";
import { toast } from "sonner";
import * as Tabs from "@radix-ui/react-tabs";
import { apiHandler } from "@app/config/apiHandler";
import { useRouter } from "next/router";
import { useMemo } from "react";

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

  const handleExport = async () => {
    try {
      const response = await apiHandler.post(
        `/projects/${id}/generate`,
        {},
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${data?.title}.md`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Export failed", err);
    }
  };

  const pendingTasks = useMemo(
    () => data?.todos.filter((el) => !el.isCompleted),
    [data]
  );

  const completedTasks = useMemo(
    () => data?.todos.filter((el) => el.isCompleted),
    [data]
  );

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
            onClick={handleExport}
          >
            Export
          </button>
        </div>
      </nav>
      <main className="flex justify-between mt-5 items-center">
        <Tabs.Root defaultValue="pending">
          <Tabs.List className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <Tabs.Trigger
              value="all"
              className="inline-flex items-center bg-gray-100 justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-black/45 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-black/75 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              All Tasks
            </Tabs.Trigger>
            <Tabs.Trigger
              value="pending"
              className="inline-flex items-center bg-gray-100 justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-black/45 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-black/75 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Pending Tasks
            </Tabs.Trigger>
            <Tabs.Trigger
              value="completed"
              className="inline-flex items-center justify-center bg-gray-100 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-black/75 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              Completed Tasks
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            value="all"
            className="mt-5 ring-offset-black   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="text-md">All Tasks</span>

            <div className="flex gap-3 mt-5 flex-wrap">
              <div
                className="min-w-[300px] h-[150px] md:h-[300px] hover:cursor-pointer  border-blue-500 border-2 rounded-md hover:border-blue-300 grid place-items-center"
                onClick={toggleNewTask.on}
              >
                New task
              </div>
              {data &&
                data.todos.map((el) => (
                  <Task
                    key={el.id}
                    title={el.title}
                    getTodo={getAllTodo}
                    id={el.id}
                    description={el.description}
                  />
                ))}
            </div>
          </Tabs.Content>

          <Tabs.Content
            value="pending"
            className="mt-5 ring-offset-black  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="text-md">All Pending tasks</span>

            <div className="flex gap-3 mt-5 flex-wrap">
              <div
                className="min-w-[300px] h-[150px]  md:h-[300px] hover:cursor-pointer  border-blue-500 border-2 rounded-md hover:border-blue-300 grid place-items-center"
                onClick={toggleNewTask.on}
              >
                New task
              </div>
              {pendingTasks &&
                pendingTasks.map((el) => (
                  <Task
                    key={el.id}
                    title={el.title}
                    getTodo={getAllTodo}
                    id={el.id}
                    description={el.description}
                  />
                ))}
            </div>
          </Tabs.Content>

          <Tabs.Content
            value="completed"
            className="mt-5 ring-offset-black   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="text-md">All Completed tasks</span>

            <div className="flex gap-3 mt-5 flex-wrap">
              <div
                className="min-w-[300px] h-[150px]  md:h-[300px] hover:cursor-pointer  border-blue-500 border-2 rounded-md hover:border-blue-300 grid place-items-center"
                onClick={toggleNewTask.on}
              >
                New task
              </div>
              {completedTasks &&
                completedTasks.map((el) => (
                  <Task
                    key={el.id}
                    title={el.title}
                    getTodo={getAllTodo}
                    id={el.id}
                    description={el.description}
                  />
                ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="settings">
            <span className="text-md">
              Edit your profile or update contact information.
            </span>
          </Tabs.Content>
        </Tabs.Root>

        <NewTask
          isOpen={isTaskOpen}
          onToggle={toggleNewTask.off}
          getAllTodo={getAllTodo}
          type="Create"
        />
      </main>
    </div>
  );
};

export default TodoPage;
