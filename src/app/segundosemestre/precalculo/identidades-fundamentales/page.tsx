"use client";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import usePrecalculo from "@/hooks/usePrecalculo";
import { Quadrant } from "@/types/index";
import TitleCourse from "@/components/TitleCourse";

export default function TrigonometriaFracciones() {
  const {
    sinNum,
    setSinNum,
    sinDen,
    setSinDen,
    quadrant,
    setQuadrant,
    fracLatex2,
    sinFrac,
    cscNum,
    cscDen,
    cosNumSq,
    cosDenSq,
    cosSimpleDen,
    cosSimpleNum,
    secNum,
    secDen,
    tanNum,
    tanDen,
    cotNum,
    cotDen,
  } = usePrecalculo();
  return (
    <div className="flex flex-col gap-4  min-h-screen  bg-gray-100 p-4">
      <TitleCourse course="Identidades Fundamentales" />

      {/* Inputs */}
      <div className="flex mb-2 flex-wrap gap-4 items-center justify-center">
        <div>
          <label className="block text-xs">Numerador (sin)</label>
          <input
            type="number"
            value={sinNum}
            onChange={(e) => setSinNum(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
        <div>
          <label className="block text-xs">Denominador (sin)</label>
          <input
            type="number"
            value={sinDen}
            onChange={(e) => setSinDen(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
        <div>
          <label className="block font-medium">Cuadrante</label>
          <select
            value={quadrant}
            onChange={(e) => setQuadrant(Number(e.target.value) as Quadrant)}
            className="border rounded px-2 py-1"
          >
            <option value={1}>I</option>
            <option value={2}>II</option>
            <option value={3}>III</option>
            <option value={4}>IV</option>
          </select>
        </div>
        <div>
          <BlockMath math={`\\sin t = ${fracLatex2(sinFrac[0], sinFrac[1])}`} />{" "}
          con <strong>t</strong> en el cuadrante {quadrant}.
        </div>
      </div>

      <div className="flex flex-wrap w-full justify-center gap-2 ">
        {/* Cosecante */}
        <div className="border-l-4 border-blue-500 bg-blue-400/10 p-1 w-auto">
          <h2 className="text-xl font-semibold">a. Cosecante</h2>
          <BlockMath
            math={`\\csc t = \\dfrac{1}{\\sin t} = ${fracLatex2(
              cscNum,
              cscDen
            )}`}
          />
        </div>

        {/* Coseno */}
        <div className="border-l-4 border-green-500  bg-green-500/10 p-1 w-auto">
          <h2 className="text-xl font-semibold">b. Coseno</h2>
          <BlockMath math="\\sin^2 t + \\cos^2 t = 1" />
          <BlockMath
            math={`(${fracLatex2(sinFrac[0], sinFrac[1])})^2 + (\\cos t)^2 = 1`}
          />
          <BlockMath
            math={`\\dfrac{${sinNum ** 2}}{${sinDen ** 2}} + (\\cos t)^2 = 1`}
          />
          <BlockMath
            math={`(\\cos t)^2 = 1 - \\dfrac{${sinNum ** 2}}{${sinDen ** 2}}`}
          />
          <BlockMath math={`(\\cos t)^2 = \\dfrac{${cosNumSq}}{${cosDenSq}}`} />
          <BlockMath
            math={`\\cos t = \\pm ${fracLatex2(
              Math.abs(cosSimpleNum),
              cosSimpleDen
            )}`}
          />
          <div>
            Como está en el cuadrante {quadrant}:{" "}
            <BlockMath
              math={`\\cos t = ${fracLatex2(cosSimpleNum, cosSimpleDen)}`}
            />
          </div>
        </div>

        {/* Secante */}
        <div className="border-l-4 border-red-500 bg-red-500/10 p-1 w-auto">
          <h2 className="text-xl font-semibold">c. Secante</h2>
          <BlockMath
            math={`\\sec t = \\dfrac{1}{\\cos t} = ${fracLatex2(
              secNum,
              secDen
            )}`}
          />
        </div>

        {/* Tangente */}
        <div className="border-l-4 border-purple-500 bg-purple-500/10 p-1 w-auto">
          <h2 className="text-xl font-semibold">d. Tangente</h2>
          <BlockMath math={`\\tan t = \\dfrac{\\sin t}{\\cos t}`} />
          <BlockMath
            math={`= \\dfrac{${fracLatex2(
              sinFrac[0],
              sinFrac[1]
            )}}{${fracLatex2(cosSimpleNum, cosSimpleDen)}}`}
          />
          <BlockMath math={`= ${fracLatex2(tanNum, tanDen)}`} />
        </div>

        {/* Cotangente */}
        <div className="border-l-4 border-orange-500 bg-orange-500/10 p-1 w-auto">
          <h2 className="text-xl font-semibold">e. Cotangente</h2>
          <BlockMath math={`\\cot t = \\dfrac{1}{\\tan t}`} />
          <BlockMath math={`= \\dfrac{1}{${fracLatex2(tanNum, tanDen)}}`} />
          <BlockMath math={`= ${fracLatex2(cotNum, cotDen)}`} />
        </div>
      </div>
    </div>
  );
}
