"use client";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonBack from "@/utils/BotonBack";
import BotonUtil from "@/utils/BotonUtil";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const EquationSolverImagenStyle: React.FC = () => {
  const { equation, setEquation, steps, solve } = usePrecalculo();

  return (
    <div className="min-h-screen px-4 py-2 bg-gray-100 flex flex-col gap-2">
      <div className="flex flex-row items-center">
        <BotonBack />
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <h1 className="text-2xl max-sm:text-base font-bold text-gray-800 text-center">
            Ecuaciones de la forma cuadrática
          </h1>
          <form className="flex flex-row items-center justify-center gap-2 w-full">
            <div className="flex flex-col">
            <label className="text-xs font-semibold">Ecuación</label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="border p-2 rounded-xl w-auto"
              placeholder="Ej.: x^4-8x^2+2=0 o 2x^2+3x-1=0"
            /></div>
            <InlineMath math={equation} />
          </form>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <BotonUtil
          label="Resolver"
          onClick={solve}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl shadow"
        />
      </div>

      <div className="flex flex-col gap-3 items-center">
        <div className="w-full max-w-3xl p-4 bg-white rounded-2xl shadow space-y-3">
          {steps}
        </div>
      </div>
    </div>
  );
};

export default EquationSolverImagenStyle;
