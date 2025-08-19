"use client";

import usePrecalculo from "@/hooks/usePrecalculo";
import BotonBack from "@/utils/BotonBack";

export default function EquationSolverImagenStyle() {
  const { equation, setEquation, steps } = usePrecalculo();

  return (
    <div className="min-h-screen px-4 py-2 bg-gray-100 flex flex-col gap-2 ">
      <div className="flex flex-row items-center">
        <BotonBack />
        <div className="flex flex-row gap-2 items-center justify-center w-full">
          <h1 className="text-2xl max-sm:text-base font-bold text-gray-800 text-center">
            Ecuaciones de la forma cuadrática
          </h1>
          <form className="flex flex-col gap-0 w-auto">
            <label className="text-xs font-semibold">Ecuación</label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="border p-2 w-full rounded-xl"
              placeholder="Ej.: x^4-8x^2+2=0 o 2x^2+3x-1=0"
            />
          </form>
        </div>
      </div>
      <div className="flex flex-row gap-2  justify-center max-sm:flex-col">
        {steps}
      </div>
    </div>
  );
}
