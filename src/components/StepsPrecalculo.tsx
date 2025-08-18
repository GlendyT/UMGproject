import React from "react";
import { BlockMath } from "react-katex";
import { StepsPrecalculoProps } from "../types";


const StepsPrecalculo = ({
  a,
  c,
  b,
  b2,
  fourac,
  disc,
  sqrtDiscR,
  twoA,
  w1R,
  w2R,
  x1R,
  x3R,
  round2,
}: StepsPrecalculoProps) => {
  return (
    <div className="space-y-6">
      {/* Paso 1 */}
      <section className="rounded-2xl border p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">1) Cambio de variable</h2>
        <p>
          Sea <span className="font-mono">w = x^2</span>. Entonces la ecuación
          se convierte en:
        </p>
        <p className="mt-2 font-mono">
          {a}w^2 {b >= 0 ? "+" : ""}
          {b}w {c >= 0 ? "+" : ""}
          {c} = 0
        </p>
      </section>

      {/* Paso 2 */}
      <section className="rounded-2xl border p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">2) Fórmula cuadrática</h2>
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
        <h2 className="font-semibold text-lg mb-2">4) Soluciones (aprox.)</h2>
        <p className="font-mono">
          {isFinite(x1R) ? `x₁ = ${x1R}, x₂ = ${-x1R}` : ""}
          {isFinite(x1R) && isFinite(x3R) ? ", " : ""}
          {isFinite(x3R) ? `x₃ = ${x3R}, x₄ = ${-x3R}` : ""}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          (También puedes expresar las soluciones exactas con raíces anidadas.)
        </p>
      </section>
    </div>
  );
};

export default StepsPrecalculo;
