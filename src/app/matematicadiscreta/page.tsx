"use client";
import { MatematicaDiscretaSlugs } from "@/utils/data/routes";
import Link from "next/link";
import React from "react";
import BotonBack from "../../utils/BotonBack";

const MatematicaDiscreta = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <BotonBack />
      <div className="flex flex-col gap-4 items-center justify-center text-4xl font-extrabold">
        <h1 className="text-2xl font-bold text-center mb-6">
          Temas de Matemática Discreta
        </h1>
        <div className="flex flex-row max-sm:flex-col items-center gap-2">
          {MatematicaDiscretaSlugs.map((slug) => (
            <Link
              href={slug.href}
              key={slug.id}
              className="w-auto max-sm:w-full h-auto text-center"
            >
              <div className="flex flex-col p-6 bg-teal-200">
                <h1 className="text-xl font-bold text-black hover:underline">
                  {slug.name}
                </h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatematicaDiscreta;
