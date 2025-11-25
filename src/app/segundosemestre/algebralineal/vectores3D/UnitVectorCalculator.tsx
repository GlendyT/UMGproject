import useAlgebra from "@/hooks/useAlgebra";
import React from "react";
import { BlockMath } from "react-katex";

const UnitVectorCalculator = () => {
  const {
    pointPx,
    setPointPx,
    pointPy,
    setPointPy,
    pointPz,
    setPointPz,
    oppositeDirection,
    setOppositeDirection,
    unitVectorSteps1,
  } = useAlgebra();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-center justify-center">
        <label className="block text-gray-700 font-medium ">
          Vector V (x, y, z):
        </label>
        <div className="flex  gap-4 ">
          <input
            type="text"
            value={pointPx}
            onChange={(e) => setPointPx(e.target.value)}
            className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
            placeholder="x"
          />
          <input
            type="text"
            value={pointPy}
            onChange={(e) => setPointPy(e.target.value)}
            className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
            placeholder="y"
          />
          <input
            type="text"
            value={pointPz}
            onChange={(e) => setPointPz(e.target.value)}
            className="mt-1 w-20 rounded-md border-gray-300 shadow-sm p-2"
            placeholder="z"
          />
        </div>
        <label className="inline-flex items-center mt-3">
          <input
            type="checkbox"
            checked={oppositeDirection}
            onChange={(e) => setOppositeDirection(e.target.checked)}
            className="form-checkbox h-5 w-5 text-indigo-600 rounded"
          />
          <span className="ml-2 text-gray-700">
            Calcular en dirección opuesta
          </span>
        </label>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Pasos del Cálculo:</h3>
        {unitVectorSteps1.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitVectorCalculator;
