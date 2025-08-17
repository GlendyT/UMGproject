"use client";

import React, { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const GeometriaPQ: React.FC = () => {
  const [puntoP, setPuntoP] = useState({ x: -2, y: 2 });
  const [puntoQ, setPuntoQ] = useState({ x: 2, y: -4 });

  const { x: x1, y: y1 } = puntoP;
  const { x: x2, y: y2 } = puntoQ;

  // Distancia
  const distancia = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // Punto medio
  const puntoMedio = {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };

  // Pendiente
  const pendiente = (x2 - x1) !== 0 ? (y2 - y1) / (x2 - x1) : Infinity;

  // Ecuación de la recta: y - y1 = m(x - x1)
  let ecuacionPasos: string[] = [];
  if (pendiente !== Infinity) {
    ecuacionPasos = [
      `y - ${y1} = m(x - (${x1}))`,
      `y - ${y1} = ${pendiente.toFixed(2)}(x - (${x1}))`,
      `y - ${y1} = ${(pendiente).toFixed(2)}x + (${(-pendiente * x1).toFixed(2)})`,
      `y = ${(pendiente).toFixed(2)}x + ${(y1 - pendiente * x1).toFixed(2)}`
    ];
  }

  return (
    <div className="p-6 space-y-10 font-mono">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold">Punto P (x₁, y₁)</h2>
          <input
            type="number"
            className="border p-1 rounded w-20 mr-2"
            value={x1}
            onChange={(e) => setPuntoP({ ...puntoP, x: Number(e.target.value) })}
          />
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={y1}
            onChange={(e) => setPuntoP({ ...puntoP, y: Number(e.target.value) })}
          />
        </div>

        <div>
          <h2 className="font-bold">Punto Q (x₂, y₂)</h2>
          <input
            type="number"
            className="border p-1 rounded w-20 mr-2"
            value={x2}
            onChange={(e) => setPuntoQ({ ...puntoQ, x: Number(e.target.value) })}
          />
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={y2}
            onChange={(e) => setPuntoQ({ ...puntoQ, y: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Distancia */}
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Distancia</h2>
        <BlockMath math={`d(P,Q) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`} />
        <BlockMath math={`d(P,Q) = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2}`} />
        <BlockMath math={`d(P,Q) = \\sqrt{(${x2 - x1})^2 + (${y2 - y1})^2}`} />
        <BlockMath math={`d(P,Q) = \\sqrt{${Math.pow(x2 - x1, 2)} + ${Math.pow(y2 - y1, 2)}}`} />
        <BlockMath math={`d(P,Q) = \\sqrt{${Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)}} \\approx ${distancia.toFixed(2)}`} />
      </div>

      {/* Punto Medio */}
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Punto Medio</h2>
        <BlockMath math={`PM = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)`} />
        <BlockMath math={`PM = \\left( \\frac{${x1} + ${x2}}{2}, \\frac{${y1} + ${y2}}{2} \\right)`} />
        <BlockMath math={`PM = (${puntoMedio.x}, ${puntoMedio.y})`} />
      </div>

      {/* Pendiente */}
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Pendiente</h2>
        <BlockMath math={`m = \\frac{y_2 - y_1}{x_2 - x_1}`} />
        <BlockMath math={`m = \\frac{${y2} - ${y1}}{${x2} - (${x1})}`} />
        {pendiente === Infinity ? (
          <BlockMath math={`m = \\text{indefinida (recta vertical)}`} />
        ) : (
          <BlockMath math={`m = \\frac{${y2 - y1}}{${x2 - x1}} = ${pendiente.toFixed(2)}`} />
        )}
      </div>

      {/* Ecuación de la recta */}
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Ecuación de la recta</h2>
        <BlockMath math={`y - y_1 = m(x - x_1)`} />
        {pendiente === Infinity ? (
          <BlockMath math={`x = ${x1}`} />
        ) : (
          ecuacionPasos.map((eq, i) => <BlockMath key={i} math={eq} />)
        )}
      </div>
    </div>
  );
};

export default GeometriaPQ;
