"use client";
import TitleCourse from "@/components/TitleCourse";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonUtil from "@/utils/BotonUtil";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

const EquationSolverImagenStyle: React.FC = () => {
  const { equation, setEquation, steps, solve } = usePrecalculo();

  return (
    <div className="min-h-screen px-4 py-2 bg-gray-100 flex flex-col gap-2">
      <TitleCourse course="Ecuaciones" />
      <div className="flex flex-wrap gap-2 items-center justify-center w-full">
        <form className="flex flex-wrap items-end justify-center gap-2 w-full">
          <div className="flex flex-col">
            <label className="text-xs font-semibold">Ecuación</label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="border p-2 rounded-xl w-auto"
              placeholder="Ej.: x^4-8x^2+2=0 o 2x^2+3x-1=0"
            />
          </div>
          <InlineMath math={equation} />
        </form>
        <BotonUtil
          label="Resolver"
          onClick={solve}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl shadow"
        />
      </div>

      <div className="flex flex-col gap-3 items-center ">{steps}</div>
    </div>
  );
};

export default EquationSolverImagenStyle;
