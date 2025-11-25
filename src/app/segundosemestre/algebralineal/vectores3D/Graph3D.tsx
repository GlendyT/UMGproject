import useAlgebra from "@/hooks/useAlgebra";
import React from "react";

const Graph3D = () => {
  const {
    originX,
    originY,
    pXAxisX,
    pXAxisY,
    pYAxisX,
    pYAxisY,
    pZAxisX,
    pZAxisY,
    pathX,
    pathY,
    shadowX,
    shadowY,
    pathXY,
    pathYX,
    px,
    py,
    parsedPointP,
    label,
  } = useAlgebra();

  return (
    <div className="flex justify-center items-center h-80 w-full bg-white rounded-md border border-gray-200 overflow-hidden relative">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        className="w-full h-full"
      >
        {/* Eje X */}
        <line
          x1={originX}
          y1={originY}
          x2={pXAxisX}
          y2={pXAxisY}
          stroke="#e74c3c"
          strokeWidth="1.5"
        />
        <text x={pXAxisX + 5} y={pXAxisY} fontSize="12" fill="#e74c3c">
          X
        </text>

        {/* Eje Y */}
        <line
          x1={originX}
          y1={originY}
          x2={pYAxisX}
          y2={pYAxisY}
          stroke="#2ecc71"
          strokeWidth="1.5"
        />
        <text x={pYAxisX - 15} y={pYAxisY} fontSize="12" fill="#2ecc71">
          Y
        </text>

        {/* Eje Z */}
        <line
          x1={originX}
          y1={originY}
          x2={pZAxisX}
          y2={pZAxisY}
          stroke="#3498db"
          strokeWidth="1.5"
        />
        <text x={pZAxisX + 5} y={pZAxisY - 5} fontSize="12" fill="#3498db">
          Z
        </text>

        {/* Proyección en el plano XY (sombra o base) */}
        <line
          x1={originX}
          y1={originY}
          x2={pathX}
          y2={pathY}
          stroke="#f39c12"
          strokeDasharray="3,3"
          strokeWidth="0.8"
        />
        <line
          x1={pathX}
          y1={pathY}
          x2={shadowX}
          y2={shadowY}
          stroke="#f39c12"
          strokeDasharray="3,3"
          strokeWidth="0.8"
        />
        <line
          x1={originX}
          y1={originY}
          x2={pathXY}
          y2={pathYX}
          stroke="#f39c12"
          strokeDasharray="3,3"
          strokeWidth="0.8"
        />

        {/* Línea vertical hasta el punto */}
        <line
          x1={shadowX}
          y1={shadowY}
          x2={px}
          y2={py}
          stroke="#c0392b"
          strokeWidth="1.5"
          strokeDasharray="4,2"
        />

        {/* Vector desde el origen al punto */}
        <line
          x1={originX}
          y1={originY}
          x2={px}
          y2={py}
          stroke="#c0392b"
          strokeWidth="2"
        />

        {/* Punto */}
        <circle cx={px} cy={py} r="4" fill="#c0392b" />
        <text
          x={px + 8}
          y={py - 8}
          fontSize="14"
          fill="#c0392b"
          fontWeight="bold"
        >
          {label} ({parsedPointP.x},{parsedPointP.y},{parsedPointP.z})
        </text>
      </svg>
    </div>
  );
};

export default Graph3D;
