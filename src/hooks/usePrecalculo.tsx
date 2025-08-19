"use client";

import PrecalculoContext from "@/context/PrecalculoProvider";
import { useContext } from "react";

const usePrecalculo = () => {
  return useContext(PrecalculoContext);
};

export default usePrecalculo;
