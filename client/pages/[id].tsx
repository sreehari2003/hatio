import { useTodo } from "@app/hooks/api";
import React from "react";

const TodoPage = () => {
  const { isLoading, data } = useTodo();
  return <div>[id]</div>;
};

export default TodoPage;
