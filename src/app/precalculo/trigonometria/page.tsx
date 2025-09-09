"use client";

import { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

interface ParsedExpression {
  outer: "sin" | "cos" | "tan";
  inner: "asin" | "acos" | "atan";
}

function parseExpression(expr: string): ParsedExpression | null {
  // Normalizamos
  const clean = expr.replace(/\s+/g, "").toLowerCase();

  const match = clean.match(/(sin|cos|tan)\((a?sin|a?cos|a?tan)\(x\)\)/);
  if (!match) return null;

  const outer = match[1] as ParsedExpression["outer"];
  let innerRaw = match[2];

  // Normalizamos: sin⁻¹ → asin, cos⁻¹ → acos
  if (innerRaw === "sin") innerRaw = "asin";
  if (innerRaw === "cos") innerRaw = "acos";
  if (innerRaw === "tan") innerRaw = "atan";

  const inner = innerRaw as ParsedExpression["inner"];

  return { outer, inner };
}

export default function TrigInversas() {
  const [input, setInput] = useState("cos(asin(x))");
  const parsed = parseExpression(input);

  // Generar pasos en LaTeX
  const renderSteps = () => {
    if (!parsed) return <p>⚠️ Expresión no soportada</p>;

    const { outer, inner } = parsed;

    if (inner === "asin") {
      if (outer === "cos") {
        return (
          <>
            <BlockMath math={`\\theta = \\sin^{-1}x`} />
            <BlockMath math={`\\sin \\theta = x`} />
            <BlockMath math={`\\cos \\theta = \\sqrt{1 - x^2}`} />
            <BlockMath math={`\\cos(\\sin^{-1}x) = \\sqrt{1 - x^2}`} />
          </>
        );
      }
      if (outer === "tan") {
        return (
          <>
            <BlockMath math={`\\theta = \\sin^{-1}x`} />
            <BlockMath math={`\\sin \\theta = x`} />
            <BlockMath math={`\\tan \\theta = \\frac{x}{\\sqrt{1 - x^2}}`} />
            <BlockMath math={`\\tan(\\sin^{-1}x) = \\frac{x}{\\sqrt{1 - x^2}}`} />
          </>
        );
      }
    }

    if (inner === "acos") {
      if (outer === "sin") {
        return (
          <>
            <BlockMath math={`\\theta = \\cos^{-1}x`} />
            <BlockMath math={`\\cos \\theta = x`} />
            <BlockMath math={`\\sin \\theta = \\sqrt{1 - x^2}`} />
            <BlockMath math={`\\sin(\\cos^{-1}x) = \\sqrt{1 - x^2}`} />
          </>
        );
      }
      if (outer === "tan") {
        return (
          <>
            <BlockMath math={`\\theta = \\cos^{-1}x`} />
            <BlockMath math={`\\cos \\theta = x`} />
            <BlockMath math={`\\tan \\theta = \\frac{\\sqrt{1 - x^2}}{x}`} />
            <BlockMath math={`\\tan(\\cos^{-1}x) = \\frac{\\sqrt{1 - x^2}}{x}`} />
          </>
        );
      }
    }

    return <p>⚠️ Esa combinación aún no la implementé.</p>;
  };

  // Generar triángulo dinámico
  const renderTriangle = () => {
    if (!parsed) return null;
    const { inner } = parsed;

    const labels =
      inner === "asin"
        ? { base: "√(1 - x²)", height: "x", hypo: "1", angle: "θ = sin⁻¹x" }
        : { base: "x", height: "√(1 - x²)", hypo: "1", angle: "θ = cos⁻¹x" };

    return (
      <svg
        width="260"
        height="200"
        viewBox="0 0 260 200"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
      >
        {/* Triángulo rectángulo */}
        <polygon
          points="20,180 220,180 220,60"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />

        {/* Etiquetas dinámicas */}
        <text x="120" y="195" fontSize="14">
          {labels.base}
        </text>
        <text x="230" y="120" fontSize="14">
          {labels.height}
        </text>
        <text x="120" y="110" fontSize="14">
          {labels.hypo}
        </text>

        {/* Ángulo theta */}
        <path
          d="M 40 180 A 25 25 0 0 1 70 170"
          stroke="green"
          strokeWidth="2"
          fill="none"
        />
        <text x="50" y="165" fontSize="14" fill="green">
          {labels.angle}
        </text>
      </svg>
    );
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Entrada */}
      <div className="col-span-2 mb-4">
        <label className="font-medium">Ingresa una expresión: </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: cos(asin(x))"
          className="border rounded p-2 ml-2 w-64"
        />
      </div>

      {/* Triángulo */}
      <div className="p-4 border rounded-2xl shadow-md bg-white flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Triángulo de referencia</h2>
        {renderTriangle()}
        <BlockMath math={`r = \\sqrt{x^2 + y^2}`} />
        <BlockMath math={`y = \\sqrt{1 - x^2}`} />
      </div>

      {/* Resolución */}
      <div className="p-4 border rounded-2xl shadow-md bg-white">
        <h2 className="text-xl font-semibold mb-4">Resolución paso a paso</h2>
        {renderSteps()}
      </div>
    </div>
  );
}
