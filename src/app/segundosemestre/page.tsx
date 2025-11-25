"use client"
import TitleCourse from "@/components/TitleCourse";
import { cursos } from "@/utils/data/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SegundoSemestre = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-between gap-2 p-4">

      <TitleCourse course="Segundo Semestre" />
      <div className="flex flex-wrap max-sm:flex-col items-center justify-center gap-6   ">
        {cursos.map((route) => (
          <Link
            key={route.id}
            href={route.href}
            className="w-auto max-sm:w-full h-auto text-center "
          >
            <Image
              src={route.image}
              alt={route.name}
              width={200}
              height={100}
              className="rounded-t-lg shadow-md transition-transform transform h-44 w-96 object-cover "
            />
            <div
              className={` flex flex-col ${route.bgColor} p-2 rounded-b-lg `}
            >
              <h1 className=" font-extrabold text-2xl ">{route.name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SegundoSemestre;
