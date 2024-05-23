import { useTodo } from "@app/hooks/api";
import { Loader } from "@app/components/Todo/Loader";
import React from "react";
import { CreateOrEditModal } from "@app/components/project/NewProject";
import { useToggle } from "@app/hooks/useToggle";

const TodoPage = () => {
  const { isLoading, data, getAllTodo } = useTodo();
  const [isOpen, toggleOpen] = useToggle();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="p-6">
      <nav className="flex justify-between">
        <CreateOrEditModal
          isOpen={isOpen}
          onToggle={toggleOpen.off}
          type="Edit"
          callBack={getAllTodo}
          projectName={data?.title}
        />
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
            onClick={toggleOpen.on}
          >
            Delete
          </button>
        </div>
      </nav>
    </div>
  );
};

export default TodoPage;
