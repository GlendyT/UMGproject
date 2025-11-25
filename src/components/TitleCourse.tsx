import BotonBack from "@/utils/BotonBack";
import React from "react";

type TitleCourseProps = {
  course: string;
};

const TitleCourse = ({ course }: TitleCourseProps) => {
  return (
    <div className="flex flex-row w-full ">
      <BotonBack />
      <h1 className="text-center w-full text-2xl font-extrabold max-sm:text-xl">
        {course}
      </h1>
    </div>
  );
};

export default TitleCourse;
