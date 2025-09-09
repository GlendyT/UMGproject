"use client";

import { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

export default function Ejemplo3Dinamico() {
  const [vel1, setVel1] = useState(200);
  const [t1, setT1] = useState(1);
  const [vel2, setVel2] = useState(200);
  const [t2, setT2] = useState(0.5);
  const [ang1, setAng1] = useState(20); // N 20° E
  const [ang2, setAng2] = useState(40); // N 40° E

  // Distancias recorridas
  const a = vel1 * t1;
  const b = vel2 * t2;

  // Ángulo interno entre trayectorias
  const A = ang2 - ang1 + 90; // corrección angular
  const A_rad = (A * Math.PI) / 180;

  // Ley de cosenos para distancia final
  const c2 = a * a + b * b - 2 * a * b * Math.cos(A_rad);
  const c = Math.sqrt(c2);

  // Ángulo B para rumbo (Ley de cosenos)
  const cosB = (a * a + c * c - b * b) / (2 * a * c);
  const B = Math.acos(cosB) * (180 / Math.PI);

  return (
    <div className="p-6 bg-white text-black min-h-screen flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Ejemplo 3 Dinámico</h1>

      {/* FORMULARIO DE ENTRADA */}
      <div className="grid grid-cols-2 gap-4 white-gray-800 p-4 rounded-lg mb-6 w-full md:w-2/3">
        <div>
          <label>Velocidad tramo 1 (mi/h): </label>
          <input
            type="number"
            value={vel1}
            onChange={(e) => setVel1(Number(e.target.value))}
            className="text-black p-1 rounded w-full"
          />
        </div>
        <div>
          <label>Tiempo tramo 1 (h): </label>
          <input
            type="number"
            value={t1}
            onChange={(e) => setT1(Number(e.target.value))}
            className="text-black p-1 rounded w-full"
          />
        </div>
        <div>
          <label>Velocidad tramo 2 (mi/h): </label>
          <input
            type="number"
            value={vel2}
            onChange={(e) => setVel2(Number(e.target.value))}
            className="text-black p-1 rounded w-full"
          />
        </div>
        <div>
          <label>Tiempo tramo 2 (h): </label>
          <input
            type="number"
            value={t2}
            onChange={(e) => setT2(Number(e.target.value))}
            className="text-black p-1 rounded w-full"
          />
        </div>
        <div>
          <label>Rumbo tramo 1 (° desde N): </label>
          <input
            type="number"
            value={ang1}
            onChange={(e) => setAng1(Number(e.target.value))}
            className="text-black p-1 rounded w-full"
          />
        </div>
        <div>
          <label>Rumbo tramo 2 (° desde N): </label>
          <input
            type="number"
            value={ang2}
            onChange={(e) => setAng2(Number(e.target.value))}
            className="text-black p-1 rounded w-full"
          />
        </div>
      </div>

      {/* SVG DEL DIAGRAMA */}
      <div className="my-6">
        <svg
          width="400"
          height="300"
          viewBox="0 0 400 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Trayecto 1 */}
          <line x1="50" y1="250" x2="250" y2="150" stroke="red" strokeWidth="2" />
          {/* Trayecto 2 */}
          <line x1="250" y1="150" x2="320" y2="80" stroke="blue" strokeWidth="2" />

          {/* Puntos */}
          <circle cx="50" cy="250" r="5" fill="yellow" />
          <circle cx="250" cy="150" r="5" fill="red" />
          <circle cx="320" cy="80" r="5" fill="blue" />

          {/* Texto */}
          <text x="20" y="260" fill="black" fontSize="12">
            Aeropuerto
          </text>
          <text x="260" y="150" fill="black" fontSize="12">
            Punto A
          </text>
          <text x="330" y="80" fill="black" fontSize="12">
            Punto final
          </text>
        </svg>
      </div>

      {/* PASO A PASO */}
      <div className="text-gray-900 p-6 rounded-lg shadow-md w-full md:w-3/4">
        <h2 className="text-lg font-semibold mb-4">
          a. Distancia entre el aeropuerto y el punto final de aterrizaje
        </h2>

        <BlockMath math={`A = ${ang2}^\\circ - ${ang1}^\\circ + 90^\\circ = ${A.toFixed(2)}^\\circ`} />
        <BlockMath math={"c^2 = a^2 + b^2 - 2ab \\cos A"} />
        <BlockMath math={`c^2 = (${a})^2 + (${b})^2 - 2(${a})(${b})\\cos(${A.toFixed(2)}^\\circ)`} />
        <BlockMath math={`c^2 = ${c2.toFixed(2)}`} />
        <BlockMath math={`c = ${c.toFixed(2)}\\, mi`} />

        <p className="mt-2">
          <strong>R//:</strong> La distancia entre el aeropuerto y el punto de
          aterrizaje es de <InlineMath math={`${c.toFixed(2)}\\, mi`} />.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-4">
          b. Rumbo del aeropuerto al punto final de aterrizaje
        </h2>

        <BlockMath math={"\\cos B = \\frac{a^2 + c^2 - b^2}{2ac}"} />
        <BlockMath
          math={`\\cos B = \\frac{(${a})^2 + (${c.toFixed(2)})^2 - (${b})^2}{2(${a})(${c.toFixed(
            2
          )})}`}
        />
        <BlockMath math={`\\cos B = ${cosB.toFixed(4)}`} />
        <BlockMath math={`B = ${B.toFixed(2)}^\\circ`} />

        <p className="mt-2">
          <strong>R//:</strong> El rumbo del aeropuerto al punto final de
          aterrizaje es <InlineMath math={`N\\,${B.toFixed(2)}^\\circ E`} />.
        </p>
      </div>
    </div>
  );
}
