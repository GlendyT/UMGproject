import React from "react";
import BotonUtil from "./BotonUtil";
import { HiChevronLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

const BotonBack = () => {
  const router = useRouter();
  return (
    <div className="flex h-full items-start justify-start  w-10">
      <BotonUtil
        onClick={() => router.back()}
        className="  text-gray-700 bg-white-100 shadow-md bg-gray-300 hover:scale-105 transition-all duration-200 ease-in-out rounded-full p-2"
        icon={<HiChevronLeft />}
      />
    </div>
  );
};

export default BotonBack;
