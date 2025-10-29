"use client";
import AlgoritmosContext from "@/context/AlgebraProvider";
import { useContext } from "react";

const useAlgebra = () => {
  return useContext(AlgoritmosContext);
};

export default useAlgebra;
