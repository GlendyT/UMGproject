import React from "react";
import Graph3D from "./Graph3D";
import { InlineMath } from "react-katex";
import useAlgebra from "@/hooks/useAlgebra";

const CrossProductCalculator = () => {
  const {
    pointPx,
    pointPy,
    pointPz,
    distP2x,
    distP2y,
    distP2z,
    setPointPx,
    setPointPy,
    setPointPz,
    setDistP2x,
    setDistP2y,
    setDistP2z,
    magnitudeSteps1,
    verificationSteps,
    crossProductSteps,
    crossProduct,
    crossMagnitude,
  } = useAlgebra();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl max-sm:text-xs text-center font-semibold text-gray-700">
        Producto Cruz (Producto Vectorial)
      </h2>
      <p className="text-center max-sm:text-xs text-gray-600">
        El producto cruz de dos vectores produce un tercer vector perpendicular
        a ambos
      </p>

      <div className="flex flex-wrap gap-2 items-center justify-center">
        <div className="flex flex-col border border-gray-400 p-2 rounded-2xl items-center justify-center">
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

        <div className="flex flex-col border border-gray-400 p-2 rounded-2xl  items-center justify-center">
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

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="bg-indigo-50 flex flex-col items-center justify-center gap-2 border-l-4 border-indigo-400 text-indigo-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            1. Cálculo del Producto Cruz:
          </h3>
          {crossProductSteps.map((step, index) => (
            <div key={index} className="mb-2">
              <InlineMath math={step} />
            </div>
          ))}
          <p className="mt-2 font-bold">
            Resultado:{" "}
            <InlineMath
              math={`\\vec{u} \\times \\vec{v} = (${crossProduct.x}, ${crossProduct.y}, ${crossProduct.z})`}
            />
          </p>
        </div>

        <div className="bg-cyan-50 flex flex-col items-center justify-center gap-2 border-l-4 border-cyan-400 text-cyan-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            2. Magnitud del Producto Cruz:
          </h3>
          {magnitudeSteps1.map((step, index) => (
            <div key={index} className="mb-2">
              <InlineMath math={step} />
            </div>
          ))}
          <p className="mt-2 font-bold">
            Magnitud: <InlineMath math={`${crossMagnitude.toFixed(2)}`} />
          </p>
        </div>

        <div className="bg-teal-50 flex flex-col items-center justify-center gap-2 border-l-4 border-teal-400 text-teal-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            3. Verificación mediante la Fórmula:
          </h3>
          <p className="mb-2 text-sm">
            La magnitud del producto cruz también se puede calcular como:
          </p>
          <InlineMath
            math={`|\\vec{u} \\times \\vec{v}| = |\\vec{u}| \\cdot |\\vec{v}| \\cdot \\sin(\\theta)`}
          />
          {verificationSteps.map((step, index) => (
            <div key={index} className="mb-2">
              <InlineMath math={step} />
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Visualización 3D del Vector Resultante:
          </h3>
          <Graph3D />
        </div>
      </div>
    </div>
  );
};

export default CrossProductCalculator;
