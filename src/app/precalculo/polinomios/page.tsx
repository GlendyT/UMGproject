"use client";
import { BlockMath } from "react-katex";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "katex/dist/katex.min.css";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonBack from "@/utils/BotonBack";

const QuadraticSolver = () => {
  const {
    a,
    b,
    c,
    setA,
    setB,
    setC,
    useFractions,
    setUseFractions,
    paso1,
    paso2,
    paso3,
    paso4,
    paso5,
    extremo,
    h,
    k,
    formatNumber,
    data,
  } = usePrecalculo();

  return (
    <div className="p-6 space-y-8 font-mono">
      <BotonBack/>
      <h2 className="text-xl font-bold">
        Ejemplo: f(x) = {a}x² + {b}x + {c}
      </h2>

      {/* Toggle */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setUseFractions(!useFractions)}
      >
        {useFractions ? "Ver en Decimales" : "Ver en Fracciones"}
      </button>

      {/* Inputs */}
      <div className="flex gap-4">
        <label>
          a:{" "}
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
          />
        </label>
        <label>
          b:{" "}
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
          />
        </label>
        <label>
          c:{" "}
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
          />
        </label>
      </div>

      {/* Paso 1: Forma normal */}
      <div>
        <h3 className="font-bold text-lg">
          1. Expresar f(x) en su forma normal
        </h3>
        <BlockMath math={paso1} />
        <BlockMath math={paso2} />
        <BlockMath math={paso3} />
        <BlockMath math={paso4} />
        <BlockMath math={paso5} />
        <BlockMath
          math={`\\text{Vértice: } (${formatNumber(h)}, ${formatNumber(k)})`}
        />
      </div>

      {/* Paso 2: Máximo o mínimo */}
      <div>
        <h3 className="font-bold text-lg">
          2. Encontrar valores máximos y/o mínimos
        </h3>
        <BlockMath math={`x = -\\frac{b}{2a}`} />
        <BlockMath math={`x = -\\frac{${b}}{2(${a})} = ${formatNumber(h)}`} />
        <BlockMath math={`f(${formatNumber(h)}) = ${formatNumber(k)}`} />
        <BlockMath
          math={`\\text{Dado que } a = ${a} \\; ${
            a > 0 ? ">" : "<"
          } \\; 0, \\text{ se tiene un ${extremo} en } f(${formatNumber(
            h
          )}) = ${formatNumber(k)}`}
        />
      </div>

      {/* Gráfica */}
      <div>
        <h3 className="font-bold text-lg">3. Gráfica de la parábola</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" type="number" domain={["auto", "auto"]} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#2563eb" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuadraticSolver;
