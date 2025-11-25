"use client";
import DriveCard from "@/components/DriveCard";
import { driveContabilidad } from "@/utils/data/routes";
import React from "react";

const AlgoritmosDrive = () => {
  return <DriveCard driveFile={driveContabilidad} />;
};

export default AlgoritmosDrive;
