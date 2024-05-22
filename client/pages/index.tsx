import { Inter } from "next/font/google";
import { Skeleton } from "@app/components/project/Skelton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`p-4 ${inter.className}`}>
      <h1 className="text-xl font-semibold">All Projects</h1>
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 grid-rows-4 mt-8">
        {new Array(16).fill(0).map((el) => (
          <Skeleton key={el} />
        ))}
      </div>
    </main>
  );
}
