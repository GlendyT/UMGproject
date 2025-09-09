"use client";
import BotonBack from "@/utils/BotonBack";
import { VideosMatematicasDiscreta } from "@/utils/data/videos";
import { YouTubeEmbed } from "@next/third-parties/google";
import React from "react";

const VideosMatematicaDiscreta = () => {
  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <div className="flex flex-row  w-full gap-4  text-4xl font-extrabold">
        <BotonBack />
        <h1 className="text-center flex items-center justify-center w-full">
          Videos Matematica Discreta
        </h1>
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        {VideosMatematicasDiscreta.map((video) => (
          <div key={video.id} className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4">{video.title} </h2>
            <div className="aspect-video ">
              <YouTubeEmbed
                videoid={video.url}
                height={500}
                width={700}
                params="controls=1&autoplay=1&mute=0&playsinline=1&loop=0"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideosMatematicaDiscreta;
