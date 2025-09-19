"use client";
import TitleCourse from "@/components/TitleCourse";
import VideoCards from "@/components/VideoCards";
import { VideosAlgebraLineal } from "@/utils/data/videos";
import React from "react";

const VideosAlgebra = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Videos Álgebra Lineal" />

      <VideoCards videoItems={VideosAlgebraLineal} />
    </section>
  );
};

export default VideosAlgebra;
