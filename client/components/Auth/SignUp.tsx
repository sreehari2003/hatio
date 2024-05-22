import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, Prop } from "./common";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../Input";
import { apiHandler } from "@app/config/apiHandler";
import { toast } from "sonner";

type FormValues = z.infer<typeof authSchema>;

export const SignUp = ({ toggleOption }: Prop) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await apiHandler.post("/auth/register", {
        ...data,
      });
      toast.success("signup success");
    } catch {
      toast.error("error signup");
    }
  };
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <Input
              id="email"
              {...register("email")}
              isError={Boolean(errors.email)}
              message={errors.email?.message}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="text-sm">
              <span
                className="font-semibold text-indigo-600 hover:text-indigo-500 hover:cursor-pointer"
                onClick={toggleOption}
              >
                Login
              </span>
            </div>
          </div>
          <div className="mt-2">
            <Input
              id="password"
              type="password"
              {...register("password")}
              isError={Boolean(errors.password)}
              message={errors.password?.message}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};
