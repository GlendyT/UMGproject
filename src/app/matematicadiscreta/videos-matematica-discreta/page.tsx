"use client";
import TitleCourse from "@/components/TitleCourse";
import VideoCards from "@/components/VideoCards";
import { VideosMatematicasDiscreta } from "@/utils/data/videos";
import React from "react";

const VideosMatematicaDiscreta = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Videos Matemática Discreta" />
      <VideoCards videoItems={VideosMatematicasDiscreta} />
    </section>
  );
};

export default VideosMatematicaDiscreta;
