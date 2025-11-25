import { YouTubeEmbed } from "@next/third-parties/google";
import React from "react";

type VideoItemsProps = {
  videoItems: {
    id: number;
    title: string;
    url: string;
  }[];
};

const VideoCards = ({ videoItems }: VideoItemsProps) => {
  return (
    <div className="flex flex-wrap gap-8  justify-center">
      {videoItems.map((video) => (
        <div
          key={video.id}
          className="flex flex-col items-center bg-gray-300 p-2 rounded-xl "
        >
          <h2 className="text-xl font-bold mb-2">{video.title} </h2>
          <div className="aspect-video ">
            <YouTubeEmbed
              videoid={video.url}
              height={100}
              width={400}
              params="controls=1&autoplay=1&mute=0&playsinline=1&loop=0"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoCards;
