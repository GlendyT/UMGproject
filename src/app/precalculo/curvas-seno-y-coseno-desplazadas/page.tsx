"use client";
import "katex/dist/katex.min.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TitleCourse from "@/components/TitleCourse";
import { BlockMath, InlineMath } from "react-katex";
import usePrecalculo from "@/hooks/usePrecalculo";

export default function TrigoEjemploDinamico() {
  const {
    funcTex,
    type,
    setType,
    aStr,
    setAStr,
    kStr,
    setKStr,
    bStr,
    setBStr,
    amplitude2,
    periodNumeric,
    periodoPaso1,
    periodoEnPiTex,
    periodoDecimalTex,
    data5,
    desfaseNumeric,
    bOverKTex,
    aTex,
    kTex,
    bTex,
  } = usePrecalculo();

  return (
    <div className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Curvas Seno y Coseno Desplazados" />

      {/* Controles (estilo simple) */}

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex flex-col w-auto">
            <label className="text-xs">Tipo: </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "cos" | "sin")}
              className="border "
            >
              <option value="cos">coseno</option>
              <option value="sin">seno</option>
            </select>
          </div>

          <div className="flex flex-col w-auto">
            <label className="text-xs">a (amplitud): </label>
            <input
              value={aStr}
              onChange={(e) => setAStr(e.target.value)}
              placeholder="ej. 5 o 3/2"
              className="border"
            />
          </div>

          <div className="flex flex-col w-auto">
            <label className="text-xs">k (frecuencia): </label>
            <input
              value={kStr}
              onChange={(e) => setKStr(e.target.value)}
              placeholder="ej. 3 o 1/2"
              className="border"
            />
          </div>

          <div className="flex flex-col w-auto">
            <label className="text-xs">b (fase en radianes): </label>
            <input
              value={bStr}
              onChange={(e) => setBStr(e.target.value)}
              placeholder="ej. pi/4"
              className="border"
            />
          </div>
        </div>
        <InlineMath math={funcTex} />
      </div>

      {/* Resultados y pasos (estilo similar a la imagen) */}
      <div className="flex flex-wrap  justify-center gap-4">
        <div className="flex flex-col w-auto  border-r pr-2 ">
          <strong>a) Amplitud</strong>
          <InlineMath math={`|a| = |${aStr}| = ${amplitude2}`} />
        </div>

        <div className="flex flex-col items-center justify-center gap-2 w-auto border-r pr-2">
          <strong>b) Periodo</strong>
          <p>Reescribimos la función factorizando k:</p>
          <BlockMath
            math={`y = ${aTex} \\cos\\left(${kTex}x - ${bTex}\\right) `}
          />
          <InlineMath
            math={`y = ${aTex} \\cos ${kTex}\\left(x - \\tfrac{${bTex}}{${kTex}}\\right)`}
          />
          <p>Ahora calculamos el periodo:</p>

          {periodoEnPiTex && (
            <InlineMath math={`${periodoPaso1}\\ = ${periodoEnPiTex}`} />
          )}
          <div className="flex flex-col items-center justify-center gap-2">
            Valor decimal (radianes):
            <InlineMath math={`p \\approx ${periodoDecimalTex}`} />
          </div>
        </div>

        <div className="flex flex-col w-auto ">
          <strong>c) Desfase</strong>
          <BlockMath
            math={
              bOverKTex
                ? `b = ${bOverKTex}`
                : Number.isNaN(desfaseNumeric)
                ? "\\text{No válido}"
                : desfaseNumeric.toFixed(6)
            }
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-6">
        <div
          style={{
            width: "100%",
            height: 380,
            background: "white",
          }}
        >
          <h3 className="text-center">d) Gráfica</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data5}
              width={900}
              height={300}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => {
                  const ratio = v / Math.PI;
                  if (Math.abs(ratio - Math.round(ratio)) < 1e-6)
                    return `${Math.round(ratio)}π`;
                  if (Math.abs(ratio * 2 - Math.round(ratio * 2)) < 1e-6)
                    return `${Math.round(ratio * 2)}/2π`;
                  return v.toFixed(2);
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `x = ${label}`}
                formatter={(value: number) => [value, "y"]}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
          Resultado final — Amplitud ={" "}
          {Number.isNaN(amplitude2) ? "—" : amplitude2}, Periodo ≈{" "}
          {Number.isNaN(periodNumeric) ? "—" : periodNumeric.toFixed(6)} rad,
          Desfase ≈{" "}
          {Number.isNaN(desfaseNumeric) ? "—" : desfaseNumeric.toFixed(6)} rad.
        </p>
      </div>
    </div>
  );
}
