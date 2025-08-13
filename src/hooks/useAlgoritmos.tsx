"use client";
import AlgoritmosContext from "@/context/AlgoritmosProvider";
import { useContext } from "react";

const useAlgoritmos = () => {
  return useContext(AlgoritmosContext);
};

export default useAlgoritmos;
