"use client";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import useAlgebra from "@/hooks/useAlgebra";
import TitleCourse from "@/components/TitleCourse";

const SarrusCalculator = () => {
  const {
    matrix2,
    handleChange2,
    cell,
    gap,
    W,
    H,
    cx,
    cy,
    extended,
    redLines,
    blueLines,
    expr,
  } = useAlgebra();

  return (
    <div className="p-6 min-h-screen flex flex-col gap-2 items-center bg-gray-100">
      <TitleCourse course="Método de Sarrus" />
      <div className="w-full flex flex-wrap justify-center gap-2">
        {/* INPUT MATRIZ */}
        <div className=" bg-white p-6 rounded-lg shadow-lg w-auto max-sm:w-full flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
            Ingrese los valores de la matriz 3x3
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {matrix2.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  value={val}
                  onChange={(e) => handleChange2(i, j, e.target.value)}
                  className="w-20 h-14 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold transition-colors"
                />
              ))
            )}
          </div>
        </div>

        <div className=" bg-white w-auto max-sm:w-full">
          {/* MATRIZ EXTENDIDA CON FLECHAS */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
              Extensión de Sarrus
            </h2>
            <div className="flex justify-center">
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
                    <div key={k} className="text-gray-700 font-semibold">
                      {val}
                    </div>
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
                      refX="16"
                      refY="6"
                      orient="auto"
                    >
                      <path d="M0,0 L0,12 L12,6 z" fill="pink" />
                    </marker>
                    <marker
                      id="arrowBlue"
                      markerWidth="12"
                      markerHeight="12"
                      refX="16"
                      refY="6"
                      orient="auto"
                    >
                      <path d="M0,0 L0,12 L12,6 z" fill="#cfd8e9" />
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
                        stroke="#fca5a5"
                        strokeWidth={2}
                        markerEnd="url(#arrowRed)"
                      />
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
                        stroke="#93c5fd"
                        strokeWidth={2}
                        markerEnd="url(#arrowBlue)"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTADO */}
        <div className="mt-8 p-8 rounded-lg shadow-lg w-auto max-sm:w-full bg-white">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Cálculo del Determinante
          </h2>
          <div className="text-center max-sm:text-xs">
            <BlockMath math={expr} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm items-center justify-center">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-extrabold text-red-800 mb-2 flex items-center">
                Diagonales Principales
              </h3>
              <div className="space-y-1 text-red-700">
                {redLines.map((r, k) => (
                  <div key={k}>
                    <InlineMath
                      math={`${matrix2[k][0]} \\times ${
                        matrix2[(k + 1) % 3][1]
                      } \\times ${matrix2[(k + 2) % 3][2]} = ${r.text}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-extrabold text-blue-800 mb-2 flex items-center ">
                Diagonales Secundarias
              </h3>
              <div className="space-y-1 text-blue-700">
                {blueLines.map((b, k) => (
                  <div key={k}>
                    <InlineMath
                      math={`${matrix2[k][2]} \\times ${
                        matrix2[(k + 1) % 3][1]
                      } \\times ${matrix2[(k + 2) % 3][0]} = ${b.text}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SarrusCalculator;
