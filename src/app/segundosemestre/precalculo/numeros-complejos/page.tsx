"use client";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import usePrecalculo from "@/hooks/usePrecalculo";
import { Op } from "@/types/index";
import TitleCourse from "@/components/TitleCourse";

// ------- componente principal -------
export default function ComplexSteps() {
  const {
    a2,
    b2,
    setA2,
    setB2,
    complexLatex,
    setOp,
    op,
    steps2,
    prettyResult,
    powSteps,
    setExp,
    exp,
  } = usePrecalculo();

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4 items-center">
      <TitleCourse course="Operaciones con Números Complejos" />
      <div className="flex flex-wrap gap-2 items-center justify-center">
        <div className="flex flex-row gap-2 border p-2 rounded-xl">
          {/* A */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-medium mb-2">Número A</div>
            <div className="flex flex-row   gap-2 items-center justify-center">
              <input
                type="number"
                className=" rounded border p-2 w-10 "
                value={a2.re}
                onChange={(e) => setA2({ ...a2, re: Number(e.target.value) })}
                placeholder="Parte real"
              />
              <input
                type="number"
                className=" rounded border p-2 w-10"
                value={a2.im}
                onChange={(e) => setA2({ ...a2, im: Number(e.target.value) })}
                placeholder="Parte imaginaria"
              />
            </div>
          </div>

          {/* B */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-sm font-medium mb-2">Número B</div>
            <div className="flex flex-row w-full gap-2 items-center justify-center">
              <input
                type="number"
                className=" rounded border p-2 w-10"
                value={b2.re}
                onChange={(e) => setB2({ ...b2, re: Number(e.target.value) })}
                placeholder="Parte real"
              />
              <input
                type="number"
                className=" rounded border p-2 w-10"
                value={b2.im}
                onChange={(e) => setB2({ ...b2, im: Number(e.target.value) })}
                placeholder="Parte imaginaria"
              />
            </div>
          </div>
        </div>
        {/* Operación */}
        <div className="p-4 rounded-xl border">
          <div className="flex flex-row items-center justify-between gap-2">
            <span className="font-medium">
              A:
              <InlineMath math={complexLatex(a2, false)} />{" "}
            </span>{" "}
            <span className="font-medium">
              B:
              <InlineMath math={complexLatex(b2, false)} />
            </span>
          </div>
          <select
            className="w-full rounded border p-2"
            value={op}
            onChange={(e) => setOp(e.target.value as Op)}
          >
            <option value="add">Suma (A + B)</option>
            <option value="sub">Resta (A − B)</option>
            <option value="mul">Multiplicación (A·B)</option>
            <option value="div">División (A / B)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-row max-sm:flex-col w-full items-start justify-center gap-2">
        {/* Pasos */}
        <div className="border flex flex-col rounded-xl p-2 items-center justify-center w-full">
          <h1 className="text-sm font-semibold">Procedimiento paso a paso</h1>
          <div className="flex flex-col">
            {steps2.map((eq, i) => (
              <div key={i} className="rounded-lg bg-gray-50 ">
                <BlockMath math={eq} />
              </div>
            ))}
          </div>
          {/* Resultado principal */}
          <div className="flex flex-row gap-2 border shadow-2xl rounded-2xl p-2 ">
            <div className="flex justify-between items-center">
              <h1 className="text-sm font-medium">Resultado</h1>
            </div>
            <div className="text-lg">
              <InlineMath math={prettyResult} />
            </div>
          </div>
        </div>

        {/* Potencias de i */}
        <div className="p-2 flex flex-col rounded-xl border w-full">
          <div className="flex items-center  gap-2">
            <h1 className="text-sm font-semibold">
              Potencias de <InlineMath math="i^n" />
            </h1>
            <div>
              <label className="text-xs block">n (entero)</label>
              <input
                type="number"
                className="rounded border p-1 w-14"
                value={exp}
                onChange={(e) => setExp(Number(e.target.value))}
              />
            </div>
          </div>

          {powSteps.map((eq, i) => (
            <div key={i} className="rounded-lg bg-gray-50 ">
              <BlockMath math={eq} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        En división se usa el conjugado para eliminar la parte imaginaria del
        denominador.
      </p>
    </div>
  );
}
