"use client";
import TitleCourse from "@/components/TitleCourse";
import VideoCards from "@/components/VideoCards";
import { videosAlgoritmo } from "@/utils/data/videos";
import React from "react";

const VideosAlgoritmos = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Videos Algoritmos" />
      <VideoCards videoItems={videosAlgoritmo} />
    </section>
  );
};

export default VideosAlgoritmos;
