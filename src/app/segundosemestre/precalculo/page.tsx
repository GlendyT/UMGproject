"use client";
import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { PrecalculoSlugs } from "@/utils/data/routes";



const Precalculo = () => {

  
  return (
    <section className="flex flex-col gap-3  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Precálculo" />
      <SubTitleCards slugLinks={PrecalculoSlugs} bgColor="bg-teal-300" />
    </section>
  );
};

export default Precalculo;
