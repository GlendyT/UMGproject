"use client";
import AlgoritmosContext from "@/context/AlgebraProvider";
import { useContext } from "react";

const useAlgoritmos = () => {
  return useContext(AlgoritmosContext);
};

export default useAlgoritmos;
