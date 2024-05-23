import { apiHandler } from "@app/config/apiHandler";
import { Todo } from "@app/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToggle } from "../useToggle";
import { ServerResponse } from "@app/types";
import { toast } from "sonner";

interface ServerData {
  title: string;
  todos: Todo[];
}

export const useTodo = () => {
  const [todos, setTodo] = useState<ServerData>();
  const [isLoading, toggleLoading] = useToggle();
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    (async () => {
      if (router.isReady) {
        try {
          toggleLoading.on();
          const { data } = await apiHandler.get<ServerResponse<ServerData>>(
            `/todo/${id}`
          );
          setTodo(data.data);
        } catch {
          toast.error("Error fetching todos");
        } finally {
          toggleLoading.off();
        }
      }
    })();
  }, [router.isReady]);

  const getAllTodo = async () => {
    try {
      const { data } = await apiHandler.get<ServerResponse<ServerData>>(
        `/todo/${id}`
      );
      setTodo(data.data);
    } catch {
      toast.error("Error fetching todos");
    }
  };

  return {
    isLoading,
    data: todos,
    getAllTodo,
  };
};
