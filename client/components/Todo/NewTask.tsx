import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const todoSchema = z.object({
  title: z.string({ message: "Title is required" }),
  description: z.string({ message: "Description is required" }),
  date: z.string({ message: "Date is required" }),
});

type FormValues = z.infer<typeof todoSchema>;

export const NewTodo = ({ cancelTodo, setTodo, defaultValue, updateTodo }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: defaultValue?.todoTitle || "",
      description: defaultValue?.todoDescription || "",
      date: defaultValue?.todoDate
        ? new Date(defaultValue.todoDate).toISOString().split("T")[0]
        : "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (defaultValue) {
      // Update logic
    } else {
      // Add logic
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="title">Title</label>
      <input id="title" {...register("title")} />
      {errors.title && <p>{errors.title.message}</p>}

      <label htmlFor="description">Description</label>
      <input id="description" {...register("description")} />
      {errors.description && <p>{errors.description.message}</p>}

      <label htmlFor="date">Date</label>
      <input type="date" {...register("date")} />
      {errors.date && <p>{errors.date.message}</p>}

      <button type="button" onClick={() => cancelTodo(false)}>
        Cancel
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};
