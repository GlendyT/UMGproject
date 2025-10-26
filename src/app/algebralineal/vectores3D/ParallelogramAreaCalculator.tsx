import React from "react";
import Graph3D from "./Graph3D";
import { BlockMath, InlineMath } from "react-katex";
import useAlgoritmos from "@/hooks/useAlgebra";

const ParallelogramAreaCalculator: React.FC = () => {
  const {
    pointPx,
    setPointPx,
    pointPy,
    setPointPy,
    pointPz,
    setPointPz,
    distP2x,
    setDistP2x,
    distP2y,
    setDistP2y,
    distP2z,
    setDistP2z,
    rx,
    setRx,
    ry,
    setRy,
    rz,
    setRz,
    pointsSteps,
    vectorSteps,
    crossProductSteps,
    areaSteps,
    triangleSteps,
    area,
    triangleArea,
  } = useAlgoritmos();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-center font-semibold text-gray-700">
        Área de Paralelogramo y Triángulo con Vértices
      </h2>
      <p className="text-center text-gray-600">
        Calcula el área usando el producto cruz de dos vectores adyacentes
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center">
          <label className="block text-gray-700 font-medium mb-2">
            Punto P (x, y, z):
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={pointPx}
              onChange={(e) => setPointPx(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="x"
            />
            <input
              type="text"
              value={pointPy}
              onChange={(e) => setPointPy(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="y"
            />
            <input
              type="text"
              value={pointPz}
              onChange={(e) => setPointPz(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="z"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <label className="block text-gray-700 font-medium mb-2">
            Punto Q (x, y, z):
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={distP2x}
              onChange={(e) => setDistP2x(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="x"
            />
            <input
              type="text"
              value={distP2y}
              onChange={(e) => setDistP2y(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="y"
            />
            <input
              type="text"
              value={distP2z}
              onChange={(e) => setDistP2z(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="z"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <label className="block text-gray-700 font-medium mb-2">
            Punto R (x, y, z):
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={rx}
              onChange={(e) => setRx(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="x"
            />
            <input
              type="text"
              value={ry}
              onChange={(e) => setRy(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="y"
            />
            <input
              type="text"
              value={rz}
              onChange={(e) => setRz(e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="z"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-l-4 border-gray-400 text-gray-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Puntos dados:</h3>
        {pointsSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          Paso 1: Calcular los vectores adyacentes
        </h3>
        <p className="mb-2 text-sm">
          Formamos dos vectores desde el punto P hacia Q y R:
        </p>
        {vectorSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          Paso 2: Calcular el producto cruz
        </h3>
        <p className="mb-2 text-sm">
          El producto cruz nos dará un vector perpendicular al plano:
        </p>
        {crossProductSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 text-green-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          Paso 3: Calcular el área del paralelogramo
        </h3>
        <p className="mb-2 text-sm">
          La magnitud del producto cruz es el área del paralelogramo:
        </p>
        {areaSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
        <div className="mt-4 p-3 bg-green-100 rounded-md">
          <p className="text-xl font-bold text-center">
            Área del Paralelogramo ≈ <InlineMath math={`${area.toFixed(4)}`} />{" "}
            unidades cuadradas
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 border-l-4 border-emerald-400 text-emerald-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          Paso 4: Área del triángulo PQR
        </h3>
        <p className="mb-2 text-sm">
          El área del triángulo es la mitad del área del paralelogramo:
        </p>
        {triangleSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
        <div className="mt-4 p-3 bg-emerald-100 rounded-md">
          <p className="text-xl font-bold text-center">
            Área del Triángulo ≈{" "}
            <InlineMath math={`${triangleArea.toFixed(4)}`} /> unidades
            cuadradas
          </p>
        </div>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-400 text-purple-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Explicación:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Un paralelogramo se puede formar con tres puntos P, Q y R, donde P
            es un vértice común
          </li>
          <li>
            Los vectores <InlineMath math="\\vec{PQ}" /> y{" "}
            <InlineMath math="\\vec{PR}" /> forman dos lados adyacentes del
            paralelogramo
          </li>
          <li>
            El producto cruz <InlineMath math="\\vec{PQ} \\times \\vec{PR}" />{" "}
            produce un vector perpendicular al plano
          </li>
          <li>
            La magnitud de este vector es exactamente el área del paralelogramo
          </li>
          <li>
            El área del triángulo PQR es la mitad del área del paralelogramo
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rose-50 border-l-4 border-rose-400 text-rose-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Punto P</h3>
          <Graph3D />
        </div>
        <div className="bg-sky-50 border-l-4 border-sky-400 text-sky-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Punto Q</h3>
          <Graph3D />
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-400 text-amber-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Punto R</h3>
          <Graph3D />
        </div>
      </div>

      <div className="bg-violet-50 border-l-4 border-violet-400 text-violet-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          Vector Normal (Producto Cruz)
        </h3>
        <p className="mb-2 text-sm">
          Este vector es perpendicular al plano que contiene el paralelogramo:
        </p>
        <Graph3D />
      </div>
    </div>
  );
};

export default ParallelogramAreaCalculator;
