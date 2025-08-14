import { LinkRoutes } from "@/utils/data/routes";
import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-extrabold">Segundo Semestre</h1>
      <div className="flex flex-row max-sm:flex-col items-center gap-2">
        {LinkRoutes.map((route) => (
          <Link key={route.id} href={route.href} className="w-auto max-sm:w-full h-auto text-center" >
            <div className={` flex flex-col ${route.bgColor} p-6 `}>
              <h1 className="text-xl font-bold text-black hover:underline">{route.name}</h1>
            </div>
            <div className="bg-red-300 h-full w-full"></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
