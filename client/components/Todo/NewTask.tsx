import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../Input";
import * as Dialog from "@radix-ui/react-dialog";
import { apiHandler } from "@app/config/apiHandler";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Span } from "next/dist/trace";

const todoSchema = z.object({
  title: z.string({ message: "Title is required" }).min(1),
  description: z.string({ message: "Description is required" }).min(5),
});

type FormValues = z.infer<typeof todoSchema>;

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  getAllTodo: () => Promise<void>;
  defaultValue?: {
    title: string;
    description: string;
    id: string;
  };
  type: "Create" | "Edit";
}

export const NewTask = ({
  isOpen,
  onToggle,
  getAllTodo,
  defaultValue,
  type = "Create",
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: defaultValue?.title || "",
      description: defaultValue?.description || "",
    },
  });

  const router = useRouter();
  const { id } = router.query;

  const onSubmit = async (data: FormValues) => {
    if (type === "Create") {
      try {
        await apiHandler.post(`/todo/${id}`, {
          ...data,
        });

        toast.success("task created successfully");
        await getAllTodo();
      } catch {
        toast.error("Error creating task");
      } finally {
        reset();
        onToggle();
      }
    }
    if (type === "Edit") {
      try {
        await apiHandler.patch(`/todo/${id}/${defaultValue?.id}`, {
          ...data,
        });

        toast.success("task created successfully");
        await getAllTodo();
      } catch {
        toast.error("Error creating task");
      } finally {
        reset();
        onToggle();
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onToggle}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-[rgba(0,0,0,0.5)] data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            {type === "Create" ? "New" : "Edit"} Task
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Make changes to your task here. Click save when done.
          </Dialog.Description>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title">Title</label>
            <Input
              className="mt-2"
              id="title"
              {...register("title")}
              isError={Boolean(errors.title)}
              message={errors.title?.message}
            />

            <div className="mt-2">
              <label htmlFor="description">Description</label>
              <textarea
                className="mt-2 w-full border-2 border-blue-300 resize-none p-3"
                id="description"
                {...register("description")}
                rows={7}
              />
              {errors.description && (
                <span className="text-red-600 font-thin">
                  {errors.description?.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-400 w-full rounded-md text-white px-3 py-2 mt-3"
            >
              Submit
            </button>
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
