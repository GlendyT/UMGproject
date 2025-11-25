"use client";
import DriveCard from "@/components/DriveCard";
import { driveAlgoritmo } from "@/utils/data/routes";
import React from "react";

const AlgoritmosDrive = () => {
  return (
    <DriveCard driveFile={driveAlgoritmo} />
  );
};

export default AlgoritmosDrive;
