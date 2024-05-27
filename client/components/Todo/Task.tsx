import { IconDelete, IconEdit, IconTickCircle } from "../icons";
import { toast } from "sonner";
import { apiHandler } from "@app/config/apiHandler";
import { useRouter } from "next/router";
import { NewTask } from "./NewTask";
import { useToggle } from "@app/hooks/useToggle";

interface Prop {
  title: string;
  description: string;
  id: string;
  getTodo: () => Promise<void>;
}

export const Task = ({ id, title, description, getTodo }: Prop) => {
  const router = useRouter();
  const [isOpen, toggleOpen] = useToggle();
  const { id: projectId } = router.query;
  const setAsComplete = async () => {
    try {
      await apiHandler.patch(`/todo/${projectId}/${id}`, {
        isCompleted: true,
      });
      toast.success("task completed successfully");
      getTodo();
    } catch {
      toast.error("failed to update task");
    }
  };

  const deleteTodo = async () => {
    try {
      await apiHandler.delete(`/todo/${projectId}/${id}`);
      toast.success("task deleted successfully");
      await getTodo();
    } catch {
      toast.error("failed to delete task");
    }
  };

  return (
    <div
      key={id}
      className="border-2 border-gray-600 w-[300px] rounded-md p-4 flex flex-col justify-between"
    >
      <h3 className="text-xl font-medium capitalize text-start">{title}</h3>
      <div className="flex gap-3 overflow-y-scroll mt-2">
        <p className="text-md">{description}</p>
      </div>

      <div className="flex mt-5 gap-3">
        <button className="px-2 py-2 border-green-600 border-2 rounded-md">
          <IconTickCircle
            onClick={setAsComplete}
            className="delete hover:cursor-pointer text-green-600"
          />
        </button>
        <button
          className="px-3 py-2 border-black border-2 rounded-md"
          onClick={toggleOpen.on}
        >
          <IconEdit className="delete hover:cursor-pointer" />
        </button>
        <button
          className="px-3 py-2 border-red-600 border-2 rounded-md"
          onClick={deleteTodo}
        >
          <IconDelete className="delete hover:cursor-pointer text-red-600" />
        </button>
      </div>
      <NewTask
        isOpen={isOpen}
        onToggle={toggleOpen.off}
        getAllTodo={getTodo}
        type="Edit"
        defaultValue={{
          title,
          description,
          id,
        }}
      />
    </div>
  );
};
