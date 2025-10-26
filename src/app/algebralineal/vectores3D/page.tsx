"use client";
import React, { useState } from "react";
import "katex/dist/katex.min.css";
import TitleCourse from "@/components/TitleCourse";
import { CalculatorType } from "@/types/index";
import GraphPointCalculator from "./GraphPointCalculator";
import DistanceCalculator from "./DistanceCalculator";
import MagnitudeCalculator from "./MagnitudeCalculator";
import UnitVectorCalculator from "./UnitVectorCalculator";
import CrossProductCalculator from "./CrossProductCalculator";
import ParallelogramAreaCalculator from "./ParallelogramAreaCalculator";

// --- Componente Principal (Página) ---
const Home: React.FC = () => {
  const [selectedCalculator, setSelectedCalculator] =
    useState<CalculatorType>("graph");

  const calculatorComponents: { [key in CalculatorType]: React.ReactNode } = {
    graph: <GraphPointCalculator />,
    distance: <DistanceCalculator />,
    magnitude: <MagnitudeCalculator />,
    unitVector: <UnitVectorCalculator />,
    crossProduct: <CrossProductCalculator />,
    parallelogramArea: <ParallelogramAreaCalculator />,
  };

  return (
    <div className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Vectores 3D" />

      {/* --- SELECTOR --- */}
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white/5 p-4 rounded ">
          <select
            id="calculator-select"
            name="calculator-select"
            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md shadow-sm"
            value={selectedCalculator}
            onChange={(e) =>
              setSelectedCalculator(e.target.value as CalculatorType)
            }
          >
            <option value="graph">Graficar un Punto P</option>
            <option value="distance">Producto de 2 Vectores</option>
            <option value="magnitude">Magnitud de un Vector</option>
            <option value="unitVector">Vector Unitario (Dirección)</option>
            <option value="crossProduct">Producto Cruz (Vectorial)</option>
            <option value="parallelogramArea">Área de Paralelogramo</option>
          </select>
        </div>
      </div>

      {/* --- CONTENEDOR DE LA CALCULADORA RENDERIZADA --- */}
      <div className="flex flex-col items-center justify-center">
        {calculatorComponents[selectedCalculator]}
      </div>
    </div>
  );
};

export default Home;
