"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import BotonBack from "@/utils/BotonBack";
import usePrecalculo from "@/hooks/usePrecalculo";

const PolynomialGX = () => {
  const {
    gLatex,
    polynomialExpr,
    handlePolynomialChange,
    factorization,
    roots,
    criticalPoints,
    data2,
    xMin,
    xMax,
  } = usePrecalculo();

  return (
    <div className="p-6 flex flex-col min-h-screen">
      <div className="flex flex-row gap-4 max-sm:flex-col w-full py-1">
        <BotonBack />
        <div className="flex w-full flex-col  justify-center items-center">
          <h2 className="text-2xl font-bold">Gráfica de f(x) = {gLatex}</h2>
          <div className="flex flex-row max-sm:flex-col  items-center justify-center gap-2 my-4">
            <label className="font-medium">Ingrese el polinomio:</label>
            <div className="flex gap-2 items-center">
              <span>f(x) =</span>
              <input
                type="text"
                value={polynomialExpr}
                onChange={handlePolynomialChange}
                className="border rounded px-2 py-1 flex-grow"
                placeholder="Ejemplo: x^3-2x^2-3x"
              />
            </div>
          </div>
        </div>
      </div>
      {/* PASO A PASO con react-katex */}
      <div className="flex flex-row max-sm:flex-col  gap-2">
        <div className="rounded-2xl border p-4 w-full">
          <div className="cursor-pointer font-semibold text-lg">
            Paso a paso (factorización y ceros)
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <BlockMath math={`f(x) = ${gLatex}`} />
            <BlockMath math={`f(x) = ${gLatex} = 0`} />
            <BlockMath math={`${factorization.expandedForm}`} />
            <BlockMath math={`${factorization.factorsForm}`} />
            <BlockMath math={`${factorization.equationForm}`} />
            <BlockMath math={`${factorization.rootsForm}`} />
          </div>
          {factorization.hasMultipleRoots && (
            <div className="mt-4 text-sm">
              <strong>Observación:</strong> la raíz \(x=
              {factorization.multipleRootValue}\) tiene multiplicidad 2 (raíz
              doble).
            </div>
          )}
        </div>

        <div className="rounded-2xl border p-4 w-full">
          <div className="w-full h-[420px]">
            <ResponsiveContainer>
              <LineChart
                data={data2}
                margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[xMin, xMax]}
                  tickCount={13}
                  label={{
                    value: "x",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{ value: "f(x)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />

                <ReferenceLine y={0} stroke="#888" strokeDasharray="4 4" />

                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={false}
                  name="f(x)"
                  isAnimationActive={false}
                />

                {roots.map((r, i) => (
                  <ReferenceDot
                    key={`root-${i}`}
                    x={r.x}
                    y={r.y}
                    r={6}
                    fill="#dc2626"
                    stroke="none"
                    label={{ value: `x=${r.x}`, position: "top" }}
                  />
                ))}

                {criticalPoints.map((p, i) => (
                  <ReferenceDot
                    key={`crit-${i}`}
                    x={p.x}
                    y={p.y}
                    r={6}
                    fill={p.type === "max" ? "#16a34a" : "#f59e0b"}
                    stroke="none"
                    label={{ value: p.label, position: "top" }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolynomialGX;
