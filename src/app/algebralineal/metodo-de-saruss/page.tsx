"use client";

import React, { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

type Matrix3x3 = number[][];

const SarrusCalculator: React.FC = () => {
  // ---------------- STATE ----------------
  const [matrix, setMatrix] = useState<Matrix3x3>([
    [-3, 4, 2],
    [2, -1, -3],
    [4, -6, 5],
  ]);

  // Update matrix value
  const handleChange = (i: number, j: number, value: string) => {
    const newMatrix = matrix.map((row) => [...row]);
    newMatrix[i][j] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  // ---------------- CÁLCULOS ----------------
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
  const extended = [...matrix, ...matrix.slice(0, 2)];

  // Productos diagonales (principales ↘ y secundarias ↙)
  const main = [
    { expr: `${a}·${e}·${i}`, val: a * e * i },
    { expr: `${b}·${f}·${g}`, val: b * f * g },
    { expr: `${c}·${d}·${h}`, val: c * d * h },
  ];
  const sec = [
    { expr: `${c}·${e}·${g}`, val: c * e * g },
    { expr: `${a}·${f}·${h}`, val: a * f * h },
    { expr: `${b}·${d}·${i}`, val: b * d * i },
  ];

  const det =
    main.reduce((s, x) => s + x.val, 0) -
    sec.reduce((s, x) => s + x.val, 0);

  const expr = `
    \\text{Det} =
    (${main.map((m) => m.val >= 0 ? `+${m.val}` : m.val).join(" ")})
    - (${sec.map((m) => m.val >= 0 ? `+${m.val}` : m.val).join(" ")})
    = ${det}
  `;

  // ---------------- DIBUJO ----------------
  const cell = 50;
  const gap = 12;
  const rows = 5;
  const cols = 3;
  const W = cols * cell + (cols - 1) * gap;
  const H = rows * cell + (rows - 1) * gap;

  const cx = (j: number) => j * (cell + gap) + cell / 2;
  const cy = (i: number) => i * (cell + gap) + cell / 2;

  const redLines = [
    { i: 0, j: 0, text: main[0] },
    { i: 1, j: 0, text: main[1] },
    { i: 2, j: 0, text: main[2] },
  ];
  const blueLines = [
    { i: 0, j: 2, text: sec[0] },
    { i: 1, j: 2, text: sec[1] },
    { i: 2, j: 2, text: sec[2] },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Método de Sarrus</h1>

      {/* INPUT MATRIZ */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={val}
              onChange={(e) => handleChange(i, j, e.target.value)}
              className="w-16 h-12 text-center border rounded"
            />
          ))
        )}
      </div>

      <div className="flex gap-12">
        {/* MATRIZ ORIGINAL */}
        <div>
          <h2 className="text-lg font-semibold text-center mb-2">
            Matriz Original
          </h2>
          <div
            className="grid text-xl font-mono"
            style={{
              gridTemplateColumns: `repeat(3, ${cell}px)`,
              gridTemplateRows: `repeat(3, ${cell}px)`,
              gap: `${gap}px`,
              placeItems: "center",
            }}
          >
            {matrix.flat().map((val, k) => (
              <div key={k}>{val}</div>
            ))}
          </div>
        </div>

        {/* MATRIZ EXTENDIDA CON FLECHAS */}
        <div>
          <h2 className="text-lg font-semibold text-center mb-2">
            Extensión de Sarrus
          </h2>
          <div className="relative" style={{ width: W, height: H }}>
            <div
              className="absolute inset-0 grid text-xl font-mono select-none"
              style={{
                gridTemplateColumns: `repeat(3, ${cell}px)`,
                gridTemplateRows: `repeat(5, ${cell}px)`,
                gap: `${gap}px`,
                placeItems: "center",
              }}
            >
              {extended.flat().map((val, k) => (
                <div key={k}>{val}</div>
              ))}
            </div>

            <svg
              className="absolute inset-0 pointer-events-none"
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
            >
              <defs>
                <marker
                  id="arrowRed"
                  markerWidth="12"
                  markerHeight="12"
                  refX="10"
                  refY="6"
                  orient="auto"
                >
                  <path d="M0,0 L0,12 L12,6 z" fill="red" />
                </marker>
                <marker
                  id="arrowBlue"
                  markerWidth="12"
                  markerHeight="12"
                  refX="10"
                  refY="6"
                  orient="auto"
                >
                  <path d="M0,0 L0,12 L12,6 z" fill="blue" />
                </marker>
              </defs>

              {/* Rojas ↘ */}
              {redLines.map((r, k) => (
                <g key={`r${k}`}>
                  <line
                    x1={cx(r.j)}
                    y1={cy(r.i)}
                    x2={cx(r.j + 2)}
                    y2={cy(r.i + 2)}
                    stroke="red"
                    strokeWidth={2.5}
                    markerEnd="url(#arrowRed)"
                  />
                  <text
                    x={cx(r.j + 2) + 15}
                    y={cy(r.i + 2)}
                    fontSize="14"
                    fill="red"
                  >
                    {`${r.text.expr}=${r.text.val}`}
                  </text>
                </g>
              ))}

              {/* Azules ↙ */}
              {blueLines.map((b, k) => (
                <g key={`b${k}`}>
                  <line
                    x1={cx(b.j)}
                    y1={cy(b.i)}
                    x2={cx(b.j - 2)}
                    y2={cy(b.i + 2)}
                    stroke="blue"
                    strokeWidth={2.5}
                    markerEnd="url(#arrowBlue)"
                  />
                  <text
                    x={cx(b.j - 2) - 80}
                    y={cy(b.i + 2)}
                    fontSize="14"
                    fill="blue"
                  >
                    {`${b.text.expr}=${b.text.val}`}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* RESULTADO */}
      <div className="mt-8 text-center">
        <BlockMath math={expr} />
      </div>
    </div>
  );
};

export default SarrusCalculator;
