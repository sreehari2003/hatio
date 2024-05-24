import { apiHandler } from "@app/config/apiHandler";
import { useAuth } from "@app/hooks/useAuth";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const TopBar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const logOut = async () => {
    try {
      await apiHandler.get("/auth/logout");
      router.push("/auth");
      toast.success("Logout successfully done");
    } catch {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="flex flex-row p-4 border-b-2 justify-between">
      <h1
        className="text-3xl font-semibold text-red-400 hover:cursor-pointer"
        onClick={() => router.push("/")}
      >
        Todo App
      </h1>

      {user && (
        <button
          className="px-3 py-2 border-2 border-red-500 text-red-500 hover:cursor-pointer"
          onClick={logOut}
        >
          Logout
        </button>
      )}
    </div>
  );
};
