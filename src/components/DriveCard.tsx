import React from "react";
import TitleCourse from "./TitleCourse";
import Image from "next/image";
import Link from "next/link";

interface DriveCardProps {
  driveFile: string;
}

const DriveCard = ({ driveFile}: DriveCardProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center  gap-6 p-4">
      <TitleCourse course="Archivos de Drive" />

      <Link
        href={driveFile}
        target="_blank"
        className="flex flex-col items-center gap-2 hover:underline "
      >
        <Image
          src="/drive.webp"
          alt="Drive Logo"
          width={200}
          height={200}
          style={{ filter: "drop-shadow(0 0 0.75rem #b2693b)" }}
        />
        <h1 className="">Click aquí</h1>
      </Link>
      <span className="">
        Para tener acceso a los documentos, tienes que tener un correo
        institucional de la Universidad Mariano Galvez
      </span>
    </div>
  );
};

export default DriveCard;
