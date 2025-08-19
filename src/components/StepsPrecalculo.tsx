import React from "react";
import { BlockMath, InlineMath } from "react-katex";
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
    <div className="flex flex-row gap-4 max-sm:flex-col w-full py-1 ">
      {/* Paso 1 */}
      <div className="flex flex-col gap-4 w-full">
        <section className="rounded-2xl border px-4 py-1 shadow-sm">
          <h2 className="font-semibold text-lg mb-2">1) Cambio de variable</h2>
          Sea <span className="font-mono">w = x^2</span>. Entonces la ecuación
          se convierte en:
          <BlockMath
            math={`${a}w^2 ${b >= 0 ? "+" : ""}${b}w ${
              c >= 0 ? "+" : ""
            }${c} = 0`}
          />
        </section>

        {/* Paso 2 */}
        <section className="rounded-2xl border px-4 py-1 shadow-sm">
          <h2 className="font-semibold text-lg mb-2">2) Fórmula cuadrática</h2>
          <div className="flex flex-col gap-1 w-full font-mono">
            <BlockMath
              math={`w = \\frac{-(${b}) \\pm \\sqrt {(${b})^2 - 4(${a})(${c})}}{2(${a})}`}
            />
            <BlockMath
              math={`= \\frac{-(${b}) \\pm \\sqrt {${b2} - ${fourac}}}{${twoA}}`}
            />
            <BlockMath
              math={`= \\frac{-(${b}) \\pm \\sqrt {${disc}}}{${twoA}}`}
            />
            <div className="flex flex-row gap-8 items-center justify-center">
              <BlockMath
                math={` w_1 \\approx \\frac{-(${b}) + ${sqrtDiscR}}{${twoA}}`}
              />
              <BlockMath
                math={` w_2 \\approx \\frac{-(${b}) - ${sqrtDiscR}}{${twoA}}`}
              />
            </div>
            <div className="flex flex-row gap-8 items-center justify-center">
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
          </div>
          <p className="text-xs text-gray-500 w-full text-center">
            * Todos los valores aproximados usan redondeo a 2 decimales para
            replicar el estilo del ejemplo.
          </p>
        </section>
      </div>

      <div className="flex flex-row max-sm:flex-col h-52 gap-4 w-full">
        {/* Paso 3 */}
        <section className="rounded-2xl border p-4 shadow-sm w-full">
          <h2 className="font-semibold text-lg mb-2">3) Volver a x</h2>
          {isFinite(x1R) ? (
            <div className="font-mono">
              x^2 = {w1R} ⇒ x = <InlineMath math={` { \\pm \\sqrt {${w1R}}}`} />{" "}
              ≈ ±{x1R}
            </div>
          ) : (
            <p className="font-mono">x^2 = {w1R} ⇒ no hay raíces reales.</p>
          )}
          {isFinite(x3R) ? (
            <p className="font-mono">
              x^2 = {w2R} ⇒ x = <InlineMath math={` { \\pm \\sqrt {${w2R}}}`} />{" "}
              ≈ ±{x3R}
            </p>
          ) : (
            <p className="font-mono">x^2 = {w2R} ⇒ no hay raíces reales.</p>
          )}
        </section>

        {/* Paso 4 */}
        <section className=" rounded-2xl border p-4 shadow-sm w-full ">
          <h2 className="font-semibold text-lg mb-2">4) Soluciones (aprox.)</h2>
          <div className="font-mono flex flex-col gap-1">
            {isFinite(x1R) && (
              <>
                <p>x₁ = {x1R}</p>
                <p>x₂ = {-x1R}</p>
              </>
            )}
            {isFinite(x3R) && (
              <>
                <p>x₃ = {x3R}</p>
                <p>x₄ = {-x3R}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StepsPrecalculo;
