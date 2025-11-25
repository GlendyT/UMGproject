"use client";
import TitleCourse from "@/components/TitleCourse";
import React from "react";

const TercerSemestre = () => {
  return (
    <section className="min-h-screen flex flex-col justify-between  gap-2 p-4">
      <TitleCourse course="Tercer Semestre" />
      <div className="flex flex-wrap max-sm:flex-col items-center justify-center gap-6   ">
        Aun no hay cursos disponibles para este semestre.
      </div>
    </section>
  );
};

export default TercerSemestre;
