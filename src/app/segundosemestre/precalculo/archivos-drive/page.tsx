"use client"
import DriveCard from "@/components/DriveCard";
import { drivePrecalculo } from "@/utils/data/routes";

const AlgoritmosDrive = () => {
  return (
    <DriveCard driveFile={drivePrecalculo} />
  );
};

export default AlgoritmosDrive;
