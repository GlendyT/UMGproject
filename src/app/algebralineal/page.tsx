"use client";

import BotonBack from "@/utils/BotonBack";
import { AlgebraLinealSlugs } from "@/utils/data/routes";
import Link from "next/link";

const Algebralineal = () => {
  return (
    <div className="min-h-screen p-4 w-full flex flex-col gap-2 bg-gray-100">
      <BotonBack />

      <div className="w-full h-full p-8  ">
        <h1 className="text-2xl font-bold text-center mb-6">
          Temas de Algebra Lineal
        </h1>
        <div className="flex flex-row max-sm:flex-col items-center gap-2 justify-center">
          {AlgebraLinealSlugs.map((slug) => (
            <Link
              href={slug.href}
              key={slug.id}
              className="w-auto max-sm:w-full h-auto text-center"
            >
              <div className={` flex flex-col  p-6 bg-violet-300 `}>
                <h1 className="text-xl font-bold text-black hover:underline">
                  {slug.name}
                </h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Algebralineal;
