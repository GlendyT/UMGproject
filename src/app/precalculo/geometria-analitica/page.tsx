"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonBack from "@/utils/BotonBack";

const GeometriaPQ: React.FC = () => {
  const {
    setPuntoP,
    puntoP,
    x1,
    y1,
    setPuntoQ,
    puntoQ,
    x2,
    y2,
    distancia,
    puntoMedio,
    pendiente,
    ecuacionPasos,
  } = usePrecalculo();

  return (
    <div className="p-6 space-y-10 font-mono">
      {/* Inputs */}
      <BotonBack/>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold">Punto P (x₁, y₁)</h2>
          <input
            type="number"
            className="border p-1 rounded w-20 mr-2"
            value={x1}
            onChange={(e) =>
              setPuntoP({ ...puntoP, x: Number(e.target.value) })
            }
          />
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={y1}
            onChange={(e) =>
              setPuntoP({ ...puntoP, y: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <h2 className="font-bold">Punto Q (x₂, y₂)</h2>
          <input
            type="number"
            className="border p-1 rounded w-20 mr-2"
            value={x2}
            onChange={(e) =>
              setPuntoQ({ ...puntoQ, x: Number(e.target.value) })
            }
          />
          <input
            type="number"
            className="border p-1 rounded w-20"
            value={y2}
            onChange={(e) =>
              setPuntoQ({ ...puntoQ, y: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Distancia */}
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Distancia</h2>
        <BlockMath math={`d(P,Q) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`} />
        <BlockMath
          math={`d(P,Q) = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2}`}
        />
        <BlockMath math={`d(P,Q) = \\sqrt{(${x2 - x1})^2 + (${y2 - y1})^2}`} />
        <BlockMath
          math={`d(P,Q) = \\sqrt{${Math.pow(x2 - x1, 2)} + ${Math.pow(
            y2 - y1,
            2
          )}}`}
        />
        <BlockMath
          math={`d(P,Q) = \\sqrt{${
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
          }} \\approx ${distancia.toFixed(2)}`}
        />
      </div>

      {/* Punto Medio */}
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Punto Medio</h2>
        <BlockMath
          math={`PM = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)`}
        />
        <BlockMath
          math={`PM = \\left( \\frac{${x1} + ${x2}}{2}, \\frac{${y1} + ${y2}}{2} \\right)`}
        />
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
          <BlockMath
            math={`m = \\frac{${y2 - y1}}{${x2 - x1}} = ${pendiente.toFixed(
              2
            )}`}
          />
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
