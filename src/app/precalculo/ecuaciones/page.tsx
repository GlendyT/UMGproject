"use client";

import BotonBack from "@/utils/BotonBack";
import 'katex/dist/katex.min.css';
import React, { JSX, useState } from "react";
import { BlockMath } from "react-katex";

function parseCoeff(raw: string, defOne = 1) {
  if (raw === undefined) return NaN;
  if (raw === "" || raw === "+") return defOne;
  if (raw === "-") return -defOne;
  return Number(raw);
}

export default function EquationSolverImagenStyle() {
  const [equation, setEquation] = useState("1x^4-8x^2+2=0");
  const round2 = (v: number) => Number(v.toFixed(2));

  let steps: JSX.Element | null = null;

  try {
    const cleaned = equation.replace(/\s+/g, "").replace(/=0$/, "");

    // --- INTENTO 1: forma bicuadrada EXACTA de la imagen: a x^4 + b x^2 + c = 0 ---
    const biquadExact = cleaned.match(
      /^([+-]?\d*)x\^4([+-]?\d*)x\^2([+-]?\d+)$/i
    );
    if (biquadExact) {
      const a = parseCoeff(biquadExact[1], 1);
      const b = parseCoeff(biquadExact[2], 1);
      const c = parseCoeff(biquadExact[3], 0);

      if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) {
        steps = <p className="text-red-500">Coeficientes inválidos.</p>;
      } else {
        // Sustitución w = x^2 → a w^2 + b w + c = 0
        const b2 = b * b;
        const fourac = 4 * a * c;
        const disc = b2 - fourac;
        const sqrtDisc = Math.sqrt(Math.max(0, disc));
        const sqrtDiscR = round2(sqrtDisc);
        const twoA = 2 * a;

        // Para replicar el estilo de la imagen, usamos la raíz redondeada para los siguientes cocientes
        const w1_disp = (-b + sqrtDiscR) / twoA;
        const w2_disp = (-b - sqrtDiscR) / twoA;
        const w1R = round2(w1_disp);
        const w2R = round2(w2_disp);

        // Paso 3: volver a x (x^2 = w)
        const x1R = w1R >= 0 ? round2(Math.sqrt(w1R)) : NaN;
        const x2R = w1R >= 0 ? -x1R : NaN;
        const x3R = w2R >= 0 ? round2(Math.sqrt(w2R)) : NaN;
        const x4R = w2R >= 0 ? -x3R : NaN;

        steps = (
          <div className="space-y-6">
            {/* Paso 1 */}
            <section className="rounded-2xl border p-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">
                1) Cambio de variable
              </h2>
              <p>
                Sea <span className="font-mono">w = x^2</span>. Entonces la
                ecuación se convierte en:
              </p>
              <p className="mt-2 font-mono">
                {a}w^2 {b >= 0 ? "+" : ""}
                {b}w {c >= 0 ? "+" : ""}
                {c} = 0
              </p>
            </section>

            {/* Paso 2 */}
            <section className="rounded-2xl border p-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">
                2) Fórmula cuadrática
              </h2>
              <div className="flex flex-col gap-2 w-full font-mono">
                <BlockMath
                  math={`w = \\frac{-(${b}) \\pm \\sqrt {(${b})^2 - 4(${a})(${c})}}{2(${a})}`}
                />
                <BlockMath
                  math={`= \\frac{-(${b}) \\pm \\sqrt {${b2} - ${fourac}}}{${twoA}}`}
                />
                <BlockMath
                  math={`= \\frac{-(${b}) \\pm \\sqrt {${disc}}}{${twoA}}`}
                />
                <BlockMath
                  math={`\\approx \\frac{-(${b}) + ${sqrtDiscR}}{${twoA}}`}
                />
                <BlockMath
                  math={`\\approx \\frac{-(${b}) - ${sqrtDiscR}}{${twoA}}`}
                />
                <BlockMath
                  math={`w_1 \\approx \\frac{${round2(
                    -b + sqrtDiscR
                  )}}{${twoA}} = ${w1R}`}
                />
                <BlockMath
                  math={`w_2 \\approx \\frac{${round2(
                    -b - sqrtDiscR
                  )}}{${twoA}} = ${w2R}`}
                />
              </div>
            </section>

            {/* Paso 3 */}
            <section className="rounded-2xl border p-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">3) Volver a x</h2>
              {isFinite(x1R) ? (
                <p className="font-mono">
                  x^2 = {w1R} ⇒ x = ±√{w1R} ≈ ±{x1R}
                </p>
              ) : (
                <p className="font-mono">x^2 = {w1R} ⇒ no hay raíces reales.</p>
              )}
              {isFinite(x3R) ? (
                <p className="font-mono">
                  x^2 = {w2R} ⇒ x = ±√{w2R} ≈ ±{x3R}
                </p>
              ) : (
                <p className="font-mono">x^2 = {w2R} ⇒ no hay raíces reales.</p>
              )}
            </section>

            {/* Paso 4 */}
            <section className="rounded-2xl border p-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">
                4) Soluciones (aprox.)
              </h2>
              <p className="font-mono">
                {isFinite(x1R) ? `x₁ = ${x1R}, x₂ = ${-x1R}` : ""}
                {isFinite(x1R) && isFinite(x3R) ? ", " : ""}
                {isFinite(x3R) ? `x₃ = ${x3R}, x₄ = ${-x3R}` : ""}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                (También puedes expresar las soluciones exactas con raíces
                anidadas.)
              </p>
            </section>
          </div>
        );
      }
    } else {
      // --- INTENTO 2: cuadrática estándar a x^2 + b x + c = 0 ---
      const quad = cleaned.match(/^([+-]?\d*)x\^2([+-]?\d*)x([+-]?\d+)$/i);
      if (quad) {
        const a = parseCoeff(quad[1], 1);
        const b = parseCoeff(quad[2], 1);
        const c = parseCoeff(quad[3], 0);

        if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) {
          steps = <p className="text-red-500">Coeficientes inválidos.</p>;
        } else {
          const b2 = b * b;
          const fourac = 4 * a * c;
          const disc = b2 - fourac;
          const sqrtDisc = Math.sqrt(Math.max(0, disc));
          const sqrtDiscR = round2(sqrtDisc);
          const twoA = 2 * a;

          const x1_disp = (-b + sqrtDiscR) / twoA;
          const x2_disp = (-b - sqrtDiscR) / twoA;
          const x1R = round2(x1_disp);
          const x2R = round2(x2_disp);

          steps = (
            <div className="space-y-6">
              <section className="rounded-2xl border p-4 shadow-sm">
                <h2 className="font-semibold text-lg mb-2">1) Datos</h2>
                <p className="font-mono">
                  a = {a}, b = {b}, c = {c}
                </p>
              </section>

              <section className="rounded-2xl border p-4 shadow-sm">
                <h2 className="font-semibold text-lg mb-2">
                  2) Fórmula cuadrática
                </h2>
                <div className="space-y-1 font-mono">
                  <BlockMath
                    math={`x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`}
                  />
                  <BlockMath
                    math={`= \\frac{-(${b}) \\pm \\sqrt{${b2} - ${fourac}}}{${twoA}}`}
                  />
                  <BlockMath
                    math={`= \\frac{-(${b}) \\pm \\sqrt{${disc}}}{${twoA}}`}
                  />
                  <BlockMath
                    math={`\\approx \\frac{-(${b}) \\pm ${sqrtDiscR}}{${twoA}}`}
                  />
                  <BlockMath
                    math={`x_1 \\approx \\frac{${round2(
                      -b + sqrtDiscR
                    )}}{${twoA}} = ${x1R}`}
                  />
                  <BlockMath
                    math={`x_2 \\approx \\frac{${round2(
                      -b - sqrtDiscR
                    )}}{${twoA}} = ${x2R}`}
                  />
                </div>
              </section>

              <section className="rounded-2xl border p-4 shadow-sm">
                <h2 className="font-semibold text-lg mb-2">3) Soluciones</h2>
                <p className="font-mono">
                  x₁ ≈ {x1R}, x₂ ≈ {x2R}
                </p>
              </section>
            </div>
          );
        }
      } else {
        steps = (
          <p className="text-red-500">
            Formato no reconocido. Ejemplos:{" "}
            <span className="font-mono">x^4-8x^2+2=0</span>,{" "}
            <span className="font-mono">2x^2+3x-1=0</span>
          </p>
        );
      }
    }
  } catch (err) {
    steps = <p className="text-red-500">Error al procesar la ecuación.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <header>
        <BotonBack/>
        <h1 className="text-2xl font-bold">
          Resolutor (estilo de pasos de la imagen)
        </h1>
        <p className="text-sm text-gray-600">
          Escribe una ecuación y verás los 4 pasos con los mismos formatos y
          redondeos.
        </p>
      </header>
      <form className="space-y-4">
        <div>
          <label className="block font-semibold">Ecuación</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="border p-2 w-full rounded-xl"
            placeholder="Ej.: x^4-8x^2+2=0 o 2x^2+3x-1=0"
          />
        </div>
      </form>
      {steps}
      <footer className="text-xs text-gray-500">
        * Todos los valores aproximados usan redondeo a 2 decimales para
        replicar el estilo del ejemplo.
      </footer>
    </div>
  );
}
