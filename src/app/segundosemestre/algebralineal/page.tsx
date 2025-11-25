"use client";

import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";
import { AlgebraLinealSlugs } from "@/utils/data/routes";

const Algebralineal = () => {
  return (
    <div className="min-h-screen p-4 w-full flex flex-col gap-2 bg-gray-100">
      <TitleCourse course="Álgebra Lineal" />
      <SubTitleCards slugLinks={AlgebraLinealSlugs} bgColor="bg-green-300" />
    </div>
  );
};

export default Algebralineal;
