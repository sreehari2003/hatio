import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../Input";

const todoSchema = z.object({
  title: z.string({ message: "Title is required" }),
  description: z.string({ message: "Description is required" }),
});

type FormValues = z.infer<typeof todoSchema>;

export const NewTask = ({ cancelTodo, setTodo, defaultValue, updateTodo }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: defaultValue?.todoTitle || "",
      description: defaultValue?.todoDescription || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (defaultValue) {
      // send patch req
    } else {
      // Add logic
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="title">Title</label>
      <Input
        id="title"
        {...register("title")}
        isError={Boolean(errors.title)}
        message={errors.title?.message}
      />

      <label htmlFor="description">Description</label>
      <Input
        id="description"
        {...register("description")}
        isError={Boolean(errors.description)}
        message={errors.title?.message}
      />

      <button type="button" onClick={() => cancelTodo(false)}>
        Cancel
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};
