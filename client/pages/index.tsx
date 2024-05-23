import { Inter } from "next/font/google";
import { Skeleton } from "@app/components/project/Skelton";
import { useProjects } from "@app/hooks/api";
import { ProjectCard } from "@app/components/project/Card";
import { CreateOrEditModal } from "@app/components/project/NewProject";
import { useToggle } from "@app/hooks/useToggle";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isLoading, data, getAllProjects } = useProjects();
  const [isOpen, toggleOpen] = useToggle();
  return (
    <main className={`p-4 ${inter.className}`}>
      <CreateOrEditModal
        isOpen={isOpen}
        onToggle={toggleOpen.off}
        type="Create"
        callBack={getAllProjects}
      />
      <h1 className="text-xl font-semibold">All Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 grid-rows-4 mt-8">
        {isLoading && new Array(16).fill(0).map((el) => <Skeleton key={el} />)}
        {data && (
          <>
            <div
              className="w-[300px] h-[150px] border-2 group p-3 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition flex justify-center items-center border-dotted flex-col hover:cursor-pointer"
              onClick={toggleOpen.on}
            >
              <div className="flex flex-col items-center group-hover:scale-110 transition justify-center gap-2">
                Create a new Project
              </div>
            </div>
            {data.map((project) => (
              <ProjectCard
                name={project.title}
                key={project.id}
                id={project.id}
              />
            ))}
          </>
        )}
      </div>
    </main>
  );
}
