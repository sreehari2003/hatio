import { useRouter } from "next/router";

export const TopBar = () => {
  const router = useRouter();
  return (
    <div className="flex flex-row p-4 border-b-2">
      <h1
        className="text-3xl font-semibold text-red-400 hover:cursor-pointer"
        onClick={() => router.push("/")}
      >
        Todo App
      </h1>
    </div>
  );
};
