"use client";
import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { AlgoritmoSlugs } from "@/utils/data/routes";

const Algoritmos = () => {


  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Algoritmos" />
      <SubTitleCards slugLinks={AlgoritmoSlugs} bgColor="bg-green-100" />
    </section>
  );
};

export default Algoritmos;
