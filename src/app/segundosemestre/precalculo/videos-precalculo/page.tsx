"use client";
import TitleCourse from "@/components/TitleCourse";
import VideoCards from "@/components/VideoCards";
import { videoPrecalculo } from "@/utils/data/routes";


const VideosPrecalculo = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Videos Precálculo" />

      <VideoCards videoItems={videoPrecalculo} />
    </section>
  );
};

export default VideosPrecalculo;
