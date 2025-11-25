"use client";

import { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export default function Ejemplo2Dinamico() {
  const [A, setA] = useState(43.1);
  const [a, set_a] = useState(186.2);
  const [b, set_b] = useState(248.6);

  // Calculos comunes
  const sinA = Math.sin(toRad(A));
  const sinBval = (b * sinA) / a;

  // Verificar rango
  const B1 = toDeg(Math.asin(Math.min(1, sinBval)));
  const B2 = 180 - B1;

  // Caso grande
  const C1 = 180 - A - B1;
  const c1 = (b * Math.sin(toRad(C1))) / Math.sin(toRad(B1));

  // Caso pequeño
  const C2 = 180 - A - B2;
  const c2 = (a * Math.sin(toRad(C2))) / Math.sin(toRad(A));

  return (
    <div className="p-6 text-black black-white min-h-screen">
      <h2 className="text-lg mb-4">
        Ejemplo 2 (Dinámico): <br />
        Resuelva el triángulo ABC formado por A, a y b
      </h2>

      {/* Inputs */}
      <div className="flex gap-4 mb-6">
        <label>
          A (°):
          <input
            type="number"
            value={A}
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="ml-2 p-1 text-black"
          />
        </label>
        <label>
          a:
          <input
            type="number"
            value={a}
            onChange={(e) => set_a(parseFloat(e.target.value))}
            className="ml-2 p-1 text-black"
          />
        </label>
        <label>
          b:
          <input
            type="number"
            value={b}
            onChange={(e) => set_b(parseFloat(e.target.value))}
            className="ml-2 p-1 text-black"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TRIÁNGULO */}
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 400 300"
            className="w-full max-w-md border border-gray-600"
          >
            {/* Lados */}
            <line x1="50" y1="250" x2="350" y2="250" stroke="red" strokeWidth="2" />
            <line x1="50" y1="250" x2="200" y2="50" stroke="blue" strokeWidth="2" />
            <line x1="350" y1="250" x2="200" y2="50" stroke="blue" strokeWidth="2" />

            {/* Etiquetas de lados */}
            <text x="120" y="160" fill="black" fontSize="14">
              {a.toFixed(1)}
            </text>
            <text x="270" y="160" fill="black" fontSize="14">
              {b.toFixed(1)}
            </text>

            {/* Ángulos */}
            <text x="60" y="265" fill="black" fontSize="14">
              A = {A.toFixed(1)}°
            </text>
            <text x="320" y="265" fill="black" fontSize="14">
              B ≈ {B1.toFixed(2)}° / {B2.toFixed(2)}°
            </text>
            <text x="180" y="40" fill="black" fontSize="14">
              C ≈ {C1.toFixed(2)}° / {C2.toFixed(2)}°
            </text>

            {/* Vértices */}
            <text x="40" y="270" fill="black" fontSize="16">
              A
            </text>
            <text x="360" y="270" fill="black" fontSize="16">
              B
            </text>
            <text x="190" y="40" fill="black" fontSize="16">
              C
            </text>
          </svg>
        </div>

        {/* CÁLCULOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Triángulo grande */}
          <div className="border border-gray-600 p-3">
            <h3 className="font-bold mb-2">Para triángulo grande:</h3>

            <BlockMath math="\frac{\sin A}{a} = \frac{\sin B}{b}" />
            <BlockMath
              math={`\\frac{\\sin ${A.toFixed(1)}^\\circ}{${a.toFixed(
                1
              )}} = \\frac{\\sin B}{${b.toFixed(1)}}`}
            />
            <BlockMath
              math={`\\sin B = \\frac{${b.toFixed(1)}}{${a.toFixed(
                1
              )}} \\cdot \\sin ${A.toFixed(1)}^\\circ`}
            />
            <BlockMath
              math={`\\sin B = ${(b / a).toFixed(4)} \\cdot ${sinA.toFixed(4)}`}
            />
            <BlockMath
              math={`\\sin B = ${sinBval.toFixed(4)} \\Rightarrow B = ${B1.toFixed(
                2
              )}^\\circ`}
            />

            <BlockMath math="A + B + C = 180^\circ" />
            <BlockMath
              math={`C = 180^\\circ - ${A.toFixed(1)}^\\circ - ${B1.toFixed(
                2
              )}^\\circ`}
            />
            <BlockMath math={`C = ${C1.toFixed(2)}^\\circ`} />

            <BlockMath math="\frac{\sin B}{b} = \frac{\sin C}{c}" />
            <BlockMath
              math={`\\frac{\\sin ${B1.toFixed(2)}^\\circ}{${b.toFixed(
                1
              )}} = \\frac{\\sin ${C1.toFixed(2)}^\\circ}{c}`}
            />
            <BlockMath
              math={`c = \\frac{${b.toFixed(1)} \\cdot \\sin ${C1.toFixed(
                2
              )}^\\circ}{\\sin ${B1.toFixed(2)}^\\circ}`}
            />
            <BlockMath
              math={`c = ${(b * Math.sin(toRad(C1))).toFixed(4)} / ${Math.sin(
                toRad(B1)
              ).toFixed(4)}`}
            />
            <BlockMath math={`c = ${c1.toFixed(2)}`} />
          </div>

          {/* Triángulo pequeño */}
          <div className="border border-gray-600 p-3">
            <h3 className="font-bold mb-2">Para triángulo pequeño:</h3>

            <BlockMath
              math={`B = 180^\\circ - ${B1.toFixed(2)}^\\circ = ${B2.toFixed(
                2
              )}^\\circ`}
            />
            <BlockMath math="A + B + C = 180^\circ" />
            <BlockMath
              math={`C = 180^\\circ - ${A.toFixed(1)}^\\circ - ${B2.toFixed(
                2
              )}^\\circ`}
            />
            <BlockMath math={`C = ${C2.toFixed(2)}^\\circ`} />

            <BlockMath math="\frac{\sin A}{a} = \frac{\sin C}{c}" />
            <BlockMath
              math={`\\frac{${a.toFixed(1)}}{\\sin ${A.toFixed(
                1
              )}^\\circ} = \\frac{c}{\\sin ${C2.toFixed(2)}^\\circ}`}
            />
            <BlockMath
              math={`c = \\frac{${a.toFixed(1)} \\cdot \\sin ${C2.toFixed(
                2
              )}^\\circ}{\\sin ${A.toFixed(1)}^\\circ}`}
            />
            <BlockMath
              math={`c = ${(a * Math.sin(toRad(C2))).toFixed(4)} / ${Math.sin(
                toRad(A)
              ).toFixed(4)}`}
            />
            <BlockMath math={`c = ${c2.toFixed(2)}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
