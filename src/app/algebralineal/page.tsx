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
        <div className="space-y-4">
          {AlgebraLinealSlugs.map((slug) => (
            <div key={slug.id} className="text-center">
              <Link
                href={slug.href}
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {slug.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Algebralineal;
