import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../Input";
import { apiHandler } from "@app/config/apiHandler";
import { toast } from "sonner";
import { useRouter } from "next/router";

const schema = z.object({
  projectName: z.string({ message: "Project Name is required" }).min(2),
});

type ProjectInfo = z.infer<typeof schema>;

interface Modal {
  projectName?: string;
  id?: string;
  isOpen: boolean;
  onToggle: () => void;
  type: "Edit" | "Create";
  callBack?: Function;
}

export const CreateOrEditModal = ({
  projectName,
  isOpen,
  onToggle,
  type,
  callBack,
}: Modal) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      projectName: projectName || "",
    },
  });

  const router = useRouter();

  const { id } = router.query;

  const createProject = async (title: string) => {
    try {
      await apiHandler.post("/projects", {
        name: title,
      });
      toast.success("Project created successfully");
      if (callBack) {
        callBack();
      }
    } catch {
      toast.error("Error creating project");
    } finally {
      onToggle();
    }
  };

  const updateProject = async (title: string) => {
    try {
      await apiHandler.patch(`/projects`, {
        name: title,
        projectId: id,
      });
      toast.success("Project created successfully");
      if (callBack) {
        callBack();
      }
    } catch {
      toast.error("Error creating project");
    } finally {
      onToggle();
    }
  };

  const onSubmit = async (data: ProjectInfo) => {
    if (type === "Create") {
      await createProject(data.projectName);
    } else {
      await updateProject(data.projectName);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onToggle}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-[rgba(0,0,0,0.5)] data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            {type} Project
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Make changes to your project here. Click save when done.
          </Dialog.Description>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-[15px] flex gap-5 flex-col bg-red-200 w-full">
              <Input
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                id="projectName"
                placeholder="project name"
                {...register("projectName")}
                isError={Boolean(errors.projectName)}
                message={errors.projectName?.message}
              />
            </div>
            <div className="mt-[25px] flex justify-end">
              <button
                className="border-2 border-gray-300 py-1 px-2 rounded-lg bg-blue-300 text-sm"
                type="submit"
              >
                Save changes
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              x
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
