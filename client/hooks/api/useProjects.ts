import { apiHandler } from "@app/config/apiHandler";
import { Projects, ServerResponse } from "@app/types";
import { useEffect, useState } from "react";
import { useToggle } from "../useToggle";
import { toast } from "sonner";

export const useProjects = () => {
  const [allProjects, setData] = useState<Projects[]>([]);
  const [isLoading, toggleLoading] = useToggle();

  useEffect(() => {
    (async () => {
      try {
        toggleLoading.on();

        const { data } = await apiHandler.get<ServerResponse<Projects[]>>(
          "/projects"
        );
        setData(data.data);
      } catch {
        toast.error("Error getting projects");
      } finally {
        toggleLoading.off();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data: allProjects,
    isLoading,
  };
};
