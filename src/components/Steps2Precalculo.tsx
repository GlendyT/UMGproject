import React from "react";
import { BlockMath } from "react-katex";
import { Steps2PrecalculoProps } from "../types";

const Steps2Precalculo = ({
  a,
  b,
  c,
  b2,
  fourac,
  disc,
  sqrtDiscR,
  twoA,
  x1R,
  x2R,
  round2,
}: Steps2PrecalculoProps) => {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">1) Datos</h2>
        <p className="font-mono">
          a = {a}, b = {b}, c = {c}
        </p>
      </section>

      <section className="rounded-2xl border p-4 shadow-sm">
        <h2 className="font-semibold text-lg mb-2">2) Fórmula cuadrática</h2>
        <div className="space-y-1 font-mono">
          <BlockMath
            math={`x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`}
          />
          <BlockMath
            math={`= \\frac{-(${b}) \\pm \\sqrt{${b2} - ${fourac}}}{${twoA}}`}
          />
          <BlockMath math={`= \\frac{-(${b}) \\pm \\sqrt{${disc}}}{${twoA}}`} />
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
};

export default Steps2Precalculo;
