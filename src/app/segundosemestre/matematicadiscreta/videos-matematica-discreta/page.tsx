"use client";
import TitleCourse from "@/components/TitleCourse";
import VideoCards from "@/components/VideoCards";
import { videoMatematicaDiscreta } from "@/utils/data/routes";


const VideosMatematicaDiscreta = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Videos Matemática Discreta" />
      <VideoCards videoItems={videoMatematicaDiscreta} />
    </section>
  );
};

export default VideosMatematicaDiscreta;
