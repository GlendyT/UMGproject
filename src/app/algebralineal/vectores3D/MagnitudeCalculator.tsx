import useAlgoritmos from "@/hooks/useAlgebra";
import React from "react";
import { BlockMath, InlineMath } from "react-katex";

const MagnitudeCalculator = () => {
  const {
    pointPx,
    setPointPx,
    pointPy,
    setPointPy,
    pointPz,
    setPointPz,
    magnitudeSteps,
    angleSteps,
    calculatedMagnitude,
  } = useAlgoritmos();

  return (
    <div className=" flex flex-col gap-2 items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-700">
        Magnitud y Ángulos en <InlineMath math="IR^3" />
      </h2>
      <div className="flex flex-col items-center justify-center w-full">
        <label className="block text-gray-700 font-medium ">
          Vector V (x, y, z):
        </label>
        <div className="flex flex-wrap justify-center gap-4">
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
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-400 text-purple-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Cálculo de Magnitud:</h3>
        {magnitudeSteps.map((step, index) => (
          <div key={index} className="mb-2">
            <BlockMath math={step} />
          </div>
        ))}
        <p className="mt-4 text-xl font-bold">
          La magnitud del vector V es aproximadamente:{" "}
          <InlineMath math={`${calculatedMagnitude.toFixed(2)}`} />
        </p>
      </div>

      {calculatedMagnitude > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Ángulos Directores:</h3>
          {angleSteps.map((step, index) => (
            <div key={index} className="mb-2">
              <BlockMath math={step} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MagnitudeCalculator;
