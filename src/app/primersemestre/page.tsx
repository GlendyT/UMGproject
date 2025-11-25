"use client";
import TitleCourse from "@/components/TitleCourse";
import React from "react";

const PrimerSemestre = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-between gap-2 p-4">
      <TitleCourse course="Primer Semestre" />
      <div className="h-full flex justify-center  ">
        <p className="">
          Aun no hay cursos disponibles para este semestre.
        </p>
      </div>
    </section>
  );
};

export default PrimerSemestre;
