"use client";
import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { ContabilidadSlugs } from "@/utils/data/routes";


const Contabilidad = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Contabilidad II" />
      <SubTitleCards slugLinks={ContabilidadSlugs} bgColor="bg-green-100" />
    </section>
  );
};

export default Contabilidad;
