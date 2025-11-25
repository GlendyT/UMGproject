import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import useAlgebra from "@/hooks/useAlgebra";

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
    vectorSteps,
    crossProductSteps1,
    areaSteps,
    area,
  } = useAlgebra();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-center font-semibold text-gray-700">
        Área de Paralelogramo
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-col border border-gray-400 p-2 rounded-2xl items-center justify-center">
          <label className="block text-gray-700 font-medium mb-2">
            Punto P (x, y, z):
          </label>
          <div className="flex flex-row gap-2">
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

        <div className="flex flex-col border border-gray-400 p-2 rounded-2xl items-center justify-center">
          <label className="block text-gray-700 font-medium mb-2">
            Punto Q (x, y, z):
          </label>
          <div className="flex flex-row gap-2">
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

        <div className="flex flex-col border border-gray-400 p-2 rounded-2xl items-center justify-center">
          <label className="block text-gray-700 font-medium mb-2">
            Punto R (x, y, z):
          </label>
          <div className="flex flex-row gap-2">
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

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="bg-blue-50 flex flex-col gap-2 items-center justify-center border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Paso 1: Calcular los vectores adyacentes
          </h3>
          {vectorSteps.map((step, index) => (
            <div
              key={index}
            >
              <InlineMath math={step} />
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 flex flex-col gap-2 items-center justify-center  border-l-4 border-indigo-400 text-indigo-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Paso 2: Calcular el producto cruz
          </h3>
          {crossProductSteps1.map((step, index) => (
            <div
              key={index}
            >
              <InlineMath math={step} />
            </div>
          ))}
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 text-green-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Paso 3: Calcular el área del paralelogramo
          </h3>
          {areaSteps.map((step, index) => (
            <div key={index} className="mb-2">
              <BlockMath math={step} />
            </div>
          ))}
          <div className="mt-4 p-3 bg-green-100 rounded-md">
            <p className="text-xl font-bold text-center">
              Área del Paralelogramo ≈{" "}
              <InlineMath math={`${area.toFixed(4)}`} /> unidades cuadradas
            </p>
          </div>
        </div>

        {/* <div className="bg-emerald-50 border-l-4 border-emerald-400 text-emerald-800 p-4 rounded-md">
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
        </div> */}
      </div>
    </div>
  );
};

export default ParallelogramAreaCalculator;
