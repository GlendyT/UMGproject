import { JSX } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { BiquadraticSolverProps } from "../types";

export const BiquadraticSolver = ({
  equation,
  a,
  b,
  c,
  factorSquare,
  sqrtDecompLatex,
  fracSimplifyLatex,
  isPerfectSquare,
  round2,
}: BiquadraticSolverProps) => {
  const steps: JSX.Element[] = [];

  const D = b * b - 4 * a * c;
  const AbsD = -D;
  const [s, r] = factorSquare(AbsD);
  const sqrtAbsD = sqrtDecompLatex(AbsD);
  const A = fracSimplifyLatex(-b, 2 * a);
  const Bi =
    r === 1
      ? fracSimplifyLatex(s, 2 * a)
      : `\\frac{${s}${r === 1 ? "" : `\\sqrt{${r}}`}}{${2 * a}}`;
  const sqrtD = Math.sqrt(D);
  const twoA = 2 * a;

  const w1 = (-b + sqrtD) / twoA;
  const w2 = (-b - sqrtD) / twoA;
  const w1R = round2(w1);
  const w2R = round2(w2);

  const styles =
    "flex flex-col items-center justify-center border rounded-2xl p-4 w-auto h-full";

  steps.push(
    <div
      key="abc"
      className="flex flex-wrap items-start justify-center w-full gap-2"
    >
      <div className={`${styles}`}>
        Resolver: <InlineMath math={equation} />
        Identificamos: <InlineMath math={`a=${a},\\;b=${b},\\;c=${c}`} />{" "}
        <div key="substitution">
          <p className="font-semibold">1) Sustitución</p>
          <BlockMath
            math={`${a}w^2 ${b >= 0 ? "+" : ""}${b}w ${
              c >= 0 ? "+" : ""
            }${c} = 0`}
          />
        </div>
      </div>
      <div key="determinante" className={`${styles}`}>
        2) Determinante <BlockMath math={`D=b^2-4ac`} />
        <BlockMath math={`=(${b})^2-4(${a})(${c})`} />
        <BlockMath math={`=${b * b}-${4 * a * c}`} />
        <BlockMath math={`Determinante=${D}`} />
        {D < 0
          ? "No tiene soluciones reales; sí tiene soluciones complejas."
          : "Tiene soluciones reales."}
      </div>
      <div key="FormulaGeneral" className={`${styles}`}>
        <p key="fg" className="font-semibold">
          3) Fórmula general en <InlineMath math={`w`} />{" "}
        </p>
        <BlockMath key="fg1" math={`w=\\frac{-b\\pm\\sqrt{D}}{2a}`} />
        <BlockMath
          key="fg2"
          math={`w=\\frac{-(${b})\\pm\\sqrt{${D}}}{2(${a})}`}
        />
      </div>
      <div className={`${styles}`}>
        {D < 0 && (
          <div key="CalculoWneg">
            <BlockMath
              key="wneg1"
              math={`=\\frac{${-b}\\pm\\sqrt{${AbsD}\\cdot(-1)}}{${2 * a}}`}
            />
            <BlockMath
              key="wneg2"
              math={`=\\frac{${-b}\\pm\\left(${sqrtAbsD}\\right)\\sqrt{-1}}{${
                2 * a
              }}`}
            />
            <BlockMath
              key="wneg3"
              math={`=\\frac{${-b}\\pm ${sqrtAbsD}\\,i}{${
                2 * a
              }}=\\frac{-(${b}){${2 * a}}\\;\\pm\\;\\frac{${sqrtAbsD}}{${
                2 * a
              }}\\,i`}
            />
            <BlockMath key="wneg4" math={`w=${A}\\pm${Bi}\\,i`} />
            <p key="wneg5">
              Como \(w=x^2\) y \(w\) es complejo, entonces \(x\) será complejo
              (no real). Tomar \\(\\sqrt{}\\) compleja excede el nivel de este
              módulo.
            </p>
          </div>
        )}
      </div>
      <div key="CalculoTitle" className={`${styles}`}>
        <p key="wcalc" className="font-semibold">
          4) Cálculo de <InlineMath math={`w_1`} /> y{" "}
          <InlineMath math={`w_2`} />
        </p>
        <BlockMath
          key="w12"
          math={`w_1=\\frac{-(${b})+${
            isPerfectSquare(D) ? String(sqrtD) : `\\sqrt{${D}}`
          }}{${twoA}}\\quad,\\quad w_2=\\frac{-(${b})-${
            isPerfectSquare(D) ? String(sqrtD) : `\\sqrt{${D}}`
          }}{${twoA}}`}
        />
        <div className="flex flex-row gap-8 items-center justify-center">
          <BlockMath
            math={` w_1 \\approx \\frac{-(${b}) + ${round2(sqrtD)}}{${round2(twoA)}}`}
          />
          <BlockMath
            math={` w_2 \\approx \\frac{-(${b}) - ${round2(sqrtD)}}{${round2(twoA)}}`}
          />
        </div>
        <div className="flex flex-row gap-8 items-center justify-center">
          <BlockMath
            math={`w_1 \\approx \\frac{${round2(
              -b + sqrtD
            )}}{${twoA}} = ${w1R}`}
          />
          <BlockMath
            math={`w_2 \\approx \\frac{${round2(
              -b - sqrtD
            )}}{${twoA}} = ${w2R}`}
          />
        </div>
      </div>
      <div className={`${styles}`} key={w1R}>
        {w1R > 0 ? (
          <div>
            <p className="font-semibold">
              5) Volver a <InlineMath math={`x`} />:{" "}
              <InlineMath math={`x^2=w`} />
            </p>
            <BlockMath
              math={`x=\\pm\\sqrt{w_1}\\;=\\;\\pm\\sqrt{${w1R}}\\;\\approx\\;\\pm${round2(
                Math.sqrt(w1R)
              )}`}
            />
          </div>
        ) : w1R === 0 ? (
          <BlockMath math={`x=0\\quad (de\\; w_1=0)`} />
        ) : (
          <div>
            <BlockMath
              math={`x=\\pm\\sqrt{${w1R}}=\\pm\\sqrt{${round2(
                Math.abs(w1R)
              )}\\cdot(-1)}`}
            />
            <BlockMath
              math={`=\\pm\\sqrt{${round2(
                Math.abs(w1R)
              )}}\\sqrt{-1}=\\pm\\sqrt{${round2(
                Math.abs(w1R)
              )}}\\,i\\;\\approx\\;\\pm${round2(Math.sqrt(Math.abs(w1R)))}\\,i`}
            />
          </div>
        )}
        {w2R > 0 ? (
          <BlockMath
            math={`x=\\pm\\sqrt{w_2}\\;=\\;\\pm\\sqrt{${w2R}}\\;\\approx\\;\\pm${round2(
              Math.sqrt(w2R)
            )}`}
          />
        ) : w2R === 0 ? (
          <BlockMath math={`x=0\\quad (de\\; w_2=0)`} />
        ) : (
          <div>
            <BlockMath
              math={`x=\\pm\\sqrt{${w2R}}=\\pm\\sqrt{${round2(
                Math.abs(w2R)
              )}\\cdot(-1)}`}
            />
            <BlockMath
              math={`=\\pm\\sqrt{${round2(
                Math.abs(w2R)
              )}}\\sqrt{-1}=\\pm\\sqrt{${round2(
                Math.abs(w2R)
              )}}\\,i\\;\\approx\\;\\pm${round2(Math.sqrt(Math.abs(w2R)))}\\,i`}
            />
          </div>
        )}
      </div>
    </div>
  );

  return steps;
};
