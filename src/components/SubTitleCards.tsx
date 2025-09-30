import Link from "next/link";
import React from "react";

type SlugTypeProps = {
  slugLinks: {
    id: number;
    name: string;
    href: string;
  }[];
  bgColor: string;
};

const SubTitleCards = ({ slugLinks, bgColor }: SlugTypeProps) => {
  return (
    <div className="flex flex-wrap  items-center justify-center gap-4 text-2xl font-semibold">
      {slugLinks.map((slug) => (
        <Link
          key={slug.id}
          href={slug.href}
          className="w-auto max-sm:w-full h-auto text-center"
        >
          <div className={`flex flex-col p-6 rounded-2xl  ${bgColor} `}>
            <h1 className="text-xl font-bold text-black hover:underline">
              {slug.name}
            </h1>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubTitleCards;
