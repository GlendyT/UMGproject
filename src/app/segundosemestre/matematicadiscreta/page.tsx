"use client";
import { MatematicaDiscretaSlugs } from "@/utils/data/routes";
import React from "react";
import SubTitleCards from "@/components/SubTitleCards";
import TitleCourse from "@/components/TitleCourse";

const MatematicaDiscreta = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Matemática Discreta" />
      <SubTitleCards slugLinks={MatematicaDiscretaSlugs} bgColor="bg-amber-300" />
    </section>
  );
};

export default MatematicaDiscreta;
