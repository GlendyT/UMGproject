import React from "react";
import Graph3D from "./Graph3D";
import { BlockMath, InlineMath } from "react-katex";
import useAlgoritmos from "@/hooks/useAlgebra";

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
    magnitudeSteps,
    verificationSteps,
    crossProductSteps,
    crossProduct,
    crossMagnitude,
  } = useAlgoritmos();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-center font-semibold text-gray-700">
        Producto Cruz (Producto Vectorial)
      </h2>
      <p className="text-center text-gray-600">
        El producto cruz de dos vectores produce un tercer vector perpendicular
        a ambos
      </p>

      <div className="flex flex-col items-center justify-center">
        <label className="block text-gray-700 font-medium mb-2">
          Vector u (x1, y1, z1):
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
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

      <div className="flex flex-col items-center justify-center">
        <label className="block text-gray-700 font-medium mb-2">
          Vector v (x2, y2, z2):
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
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

      <div className="bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          1. Cálculo del Producto Cruz:
        </h3>
        {crossProductSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
        <p className="mt-2 font-bold">
          Resultado:{" "}
          <InlineMath
            math={`\\vec{u} \\times \\vec{v} = (${crossProduct.x}, ${crossProduct.y}, ${crossProduct.z})`}
          />
        </p>
      </div>

      <div className="bg-cyan-50 border-l-4 border-cyan-400 text-cyan-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          2. Magnitud del Producto Cruz:
        </h3>
        {magnitudeSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
        <p className="mt-2 font-bold">
          Magnitud: <InlineMath math={`${crossMagnitude.toFixed(2)}`} />
        </p>
      </div>

      <div className="bg-teal-50 border-l-4 border-teal-400 text-teal-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          3. Verificación mediante la Fórmula:
        </h3>
        <p className="mb-2 text-sm">
          La magnitud del producto cruz también se puede calcular como:
        </p>
        <BlockMath math="|\\vec{u} \\times \\vec{v}| = |\\vec{u}| \\cdot |\\vec{v}| \\cdot \\sin(\\theta)" />
        {verificationSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
        <p className="mt-2 font-bold">
          Verificación: Ambos métodos dan aproximadamente el mismo resultado
        </p>
      </div>

      <div className="bg-pink-50 border-l-4 border-pink-400 text-pink-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Propiedades:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            El vector resultante es perpendicular a ambos vectores originales
          </li>
          <li>La dirección sigue la regla de la mano derecha</li>
          <li>
            <InlineMath math="\\vec{u} \\times \\vec{v} = -\\vec{v} \\times \\vec{u}" />{" "}
            (anticonmutativo)
          </li>
          <li>
            Si los vectores son paralelos, el producto cruz es el vector cero
          </li>
          <li>
            La magnitud representa el área del paralelogramo formado por los dos
            vectores
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">
          Visualización 3D del Vector Resultante:
        </h3>
        <Graph3D />
      </div>
    </div>
  );
};

export default CrossProductCalculator;
