"use client";
import BotonBack from "@/utils/BotonBack";
import { PrecalculoSlugs } from "@/utils/data/routes";
import Link from "next/link";

const Precalculo = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <BotonBack />
      <div className="flex flex-col gap-4 items-center justify-center text-4xl font-extrabold">
        <h1>Precalculo</h1>
        {PrecalculoSlugs.map((slug) => (
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
    </section>
  );
};

export default Precalculo;
