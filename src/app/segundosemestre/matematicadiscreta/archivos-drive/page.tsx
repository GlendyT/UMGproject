"use client"
import DriveCard from "@/components/DriveCard";
import { driveMatematicaDiscreta } from "@/utils/data/routes";
import React from "react";

const AlgoritmosDrive = () => {
  return (
    <DriveCard driveFile={driveMatematicaDiscreta} />
  );
};

export default AlgoritmosDrive;
