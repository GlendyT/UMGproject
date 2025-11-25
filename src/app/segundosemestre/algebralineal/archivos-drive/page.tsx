
"use client"
import DriveCard from "@/components/DriveCard";
import { driveAlgebraLineal } from "@/utils/data/routes";
import React from "react";

const AlgoritmosDrive = () => {

  return (
    <DriveCard driveFile={driveAlgebraLineal} />
  );
};

export default AlgoritmosDrive;
