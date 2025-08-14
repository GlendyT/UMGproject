"use client";
import { MatematicaDiscretaSlugs } from "@/utils/data/routes";
import Link from "next/link";
import React from "react";
import BotonBack from "../../utils/BotonBack";

const MatematicaDiscreta = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <BotonBack />
      <div className="w-full h-full p-8  ">
        <h1 className="text-2xl font-bold text-center mb-6">
          Temas de Matemática Discreta
        </h1>
        <div className="space-y-4">
          {MatematicaDiscretaSlugs.map((slug) => (
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
    </section>
  );
};

export default MatematicaDiscreta;
