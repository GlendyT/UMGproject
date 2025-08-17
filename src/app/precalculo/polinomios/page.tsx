"use client";

import React, { useState } from "react";
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
import Fraction from "fraction.js";
import "katex/dist/katex.min.css";

const QuadraticSolver: React.FC = () => {
  const [a, setA] = useState(-1);
  const [b, setB] = useState(1);
  const [c, setC] = useState(2);
  const [useFractions, setUseFractions] = useState(false);

  // Vértice
  const h = -b / (2 * a);
  const k = a * h * h + b * h + c;

  // Fracciones si el toggle está activado
  const formatNumber = (num: number) => {
    if (useFractions) {
      return new Fraction(num).toFraction(true); // forma simplificada
    }
    return num.toFixed(2);
  };

  // Forma normal paso a paso
  // f(x) = ax^2 + bx + c
  // completando el cuadrado
  const paso1 = `f(x) = ${a}x^2 + ${b}x + ${c}`;
  const paso2 = `f(x) = ${a}\\left(x^2 + \\frac{${b}}{${a}}x\\right) + ${c}`;
  const paso3 = `f(x) = ${a}\\left(x^2 + ${formatNumber(
    b / a
  )}x + \\left(\\frac{${b}}{2${a}}\\right)^2 - \\left(\\frac{${b}}{2${a}}\\right)^2\\right) + ${c}`;
  const paso4 = `f(x) = ${a}\\left((x + \\frac{${b}}{2${a}})^2 - \\left(\\frac{${b}}{2${a}}\\right)^2\\right) + ${c}`;
  const paso5 = `f(x) = ${a}(x - (${formatNumber(h)}))^2 + ${formatNumber(k)}`;

  // Máximo o mínimo
  const extremo = a > 0 ? "mínimo" : "máximo";

  // Generar datos para graficar
  const data = Array.from({ length: 41 }, (_, i) => {
    const x = h - 5 + i * 0.25;
    return { x, y: a * x * x + b * x + c };
  });

  return (
    <div className="p-6 space-y-8 font-mono">
      <h2 className="text-xl font-bold">Ejemplo: f(x) = {a}x² + {b}x + {c}</h2>

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
        <h3 className="font-bold text-lg">1. Expresar f(x) en su forma normal</h3>
        <BlockMath math={paso1} />
        <BlockMath math={paso2} />
        <BlockMath math={paso3} />
        <BlockMath math={paso4} />
        <BlockMath math={paso5} />
        <BlockMath math={`\\text{Vértice: } (${formatNumber(h)}, ${formatNumber(k)})`} />
      </div>

      {/* Paso 2: Máximo o mínimo */}
      <div>
        <h3 className="font-bold text-lg">2. Encontrar valores máximos y/o mínimos</h3>
        <BlockMath math={`x = -\\frac{b}{2a}`} />
        <BlockMath math={`x = -\\frac{${b}}{2(${a})} = ${formatNumber(h)}`} />
        <BlockMath
          math={`f(${formatNumber(h)}) = ${formatNumber(k)}`}
        />
        <BlockMath
          math={`\\text{Dado que } a = ${a} \\; ${a > 0 ? ">" : "<"} \\; 0, \\text{ se tiene un ${extremo} en } f(${formatNumber(
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
