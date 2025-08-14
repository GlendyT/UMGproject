import React from "react";
import BotonUtil from "./BotonUtil";
import { HiChevronLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

const BotonBack = () => {
  const router = useRouter();
  return (
    <div className="flex h-full items-start justify-start">
      <BotonUtil
        onClick={() => router.back()}
        className="  text-gray-700 bg-white-100 shadow-md "
        icon={<HiChevronLeft />}
      />
    </div>
  );
};

export default BotonBack;
