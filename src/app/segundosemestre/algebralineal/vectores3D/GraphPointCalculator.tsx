import React from "react";
import Graph3D from "./Graph3D";
import { InlineMath } from "react-katex";
import useAlgebra from "@/hooks/useAlgebra";

const GraphPointCalculator = () => {
  const {
    pointPx,
    pointPy,
    pointPz,
    setPointPx,
    setPointPy,
    setPointPz,
  } = useAlgebra();

  return (
    <div className="flex flex-col gap-2 ">
      <h2 className="text-2xl font-semibold text-gray-700 ">
        Graficar el punto P
      </h2>
      <p className="text-gray-600">Introduce las coordenadas</p>

      <div className="flex flex-wrap items-center justify-center w-full gap-4 mb-6">
        <label className="">
          <span className="text-gray-700 w-full text-center flex justify-center font-medium">
            X
          </span>
          <input
            type="text"
            value={pointPx}
            onChange={(e) => setPointPx(e.target.value)}
            className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            placeholder="Ej: -2"
          />
        </label>
        <label className="">
          <span className="text-gray-700 font-medium w-full text-center flex justify-center ">
            Y
          </span>
          <input
            type="text"
            value={pointPy}
            onChange={(e) => setPointPy(e.target.value)}
            className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            placeholder="Ej: 3"
          />
        </label>
        <label className="">
          <span className="text-gray-700 font-medium w-full text-center flex justify-center ">
            Z
          </span>
          <input
            type="text"
            value={pointPz}
            onChange={(e) => setPointPz(e.target.value)}
            className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            placeholder="Ej: 5"
          />
        </label>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          Gráfico 3D (Vista Isométrica)
        </h3>
        <p className="mb-4">
          Representación del punto <InlineMath math="P" /> en un espacio
          tridimensional.
        </p>
        <Graph3D
        />
      </div>
    </div>
  );
};

export default GraphPointCalculator;
