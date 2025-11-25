import useAlgebra from "@/hooks/useAlgebra";
import React from "react";
import { InlineMath } from "react-katex";

const DistanceCalculator = () => {
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
    dotProduct,
    dotProductSteps,
    mag1,
    mag1Steps,
    mag2,
    mag2Steps,
    distance,
    distanceSteps,
    angleDeg,
    angleSteps,
  } = useAlgebra();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl max-sm:text-xs text-center font-semibold text-gray-700">
        Producto de Vectores, Magnitudes, Distancia y Ángulo
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center border p-2 rounded-2xl border-gray-400">
          <label className="block text-gray-700 font-medium mb-2">
            Vector u (x1, y1, z1):
          </label>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              value={pointPx}
              onChange={(e) => setPointPx(e.target.value)}
              className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="x1"
            />
            <input
              type="text"
              value={pointPy}
              onChange={(e) => setPointPy(e.target.value)}
              className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="y1"
            />
            <input
              type="text"
              value={pointPz}
              onChange={(e) => setPointPz(e.target.value)}
              className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="z1"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border p-2 rounded-2xl border-gray-400">
          <label className="block text-gray-700 font-medium mb-2">
            Vector v (x2, y2, z2):
          </label>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              value={distP2x}
              onChange={(e) => setDistP2x(e.target.value)}
              className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="x2"
            />
            <input
              type="text"
              value={distP2y}
              onChange={(e) => setDistP2y(e.target.value)}
              className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="y2"
            />
            <input
              type="text"
              value={distP2z}
              onChange={(e) => setDistP2z(e.target.value)}
              className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
              placeholder="z2"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="bg-blue-50 flex flex-col gap-4 items-center justify-center border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold ">1. Producto Escalar:</h3>
          {dotProductSteps.map((step, index) => (
            <div key={index}>
              <InlineMath math={step} />
            </div>
          ))}
          <p className=" font-bold">
            Resultado: <InlineMath math={`${dotProduct}`} />
          </p>
        </div>

        <div className="bg-orange-50 flex flex-col gap-4 items-center justify-center border-l-4 border-orange-400 text-orange-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            2. Magnitud del Vector u:
          </h3>
          {mag1Steps.map((step, index) => (
            <div key={index}>
              <InlineMath math={step} />
            </div>
          ))}
          <p className=" font-bold">
            Magnitud: <InlineMath math={`${mag1.toFixed(2)}`} />
          </p>
        </div>

        <div className="bg-yellow-50 flex flex-col gap-4 items-center justify-center border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold">3. Magnitud del Vector v:</h3>
          {mag2Steps.map((step, index) => (
            <div key={index}>
              <InlineMath math={step} />
            </div>
          ))}
          <p className=" font-bold">
            Magnitud: <InlineMath math={`${mag2.toFixed(2)}`} />
          </p>
        </div>

        <div className="bg-green-50 flex flex-col gap-4 items-center justify-center border-l-4 border-green-400 text-green-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold">4. Distancia entre Puntos:</h3>
          {distanceSteps.map((step, index) => (
            <div key={index}>
              <InlineMath math={step} />
            </div>
          ))}
          <p className=" font-bold">
            Distancia: <InlineMath math={`${distance.toFixed(2)}`} />
          </p>
        </div>

        <div className="bg-purple-50 flex flex-col gap-4 items-center justify-center border-l-4 border-purple-400 text-purple-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold">5. Ángulo entre Vectores:</h3>
          {angleSteps.map((step, index) => (
            <div key={index}>
              <InlineMath math={step} />
            </div>
          ))}
          <p className=" font-bold">
            Ángulo: <InlineMath math={`${angleDeg.toFixed(2)}°`} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default DistanceCalculator;
