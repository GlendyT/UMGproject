"use client";
import TitleCourse from "@/components/TitleCourse";
import VideoCards from "@/components/VideoCards";
import { videoContabilidad } from "@/utils/data/routes";


const VideosContabilidad = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Videos Contabilidad II" />

      <VideoCards videoItems={videoContabilidad} />
    </section>
  );
};

export default VideosContabilidad;
