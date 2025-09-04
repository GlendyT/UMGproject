import { JSX } from "react";
import { BlockMath, InlineMath } from "react-katex";

interface BiquadraticSolverProps {
  equation: string;
  a: number;
  b: number;
  c: number;
  factorSquare: (n: number) => [number, number];
  sqrtDecompLatex: (n: number) => string;
  fracSimplifyLatex: (num: number, den: number) => string;
  isPerfectSquare: (n: number) => boolean;
  round2: (n: number) => number;
}

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

  steps.push(
    <p key="abc" className="flex flex-col">
      Resolver: <InlineMath math={equation} />
      Identificamos: <InlineMath math={`a=${a},\\;b=${b},\\;c=${c}`} />{" "}
    </p>
  );
  steps.push(
    <div key="substitution">
      <p className="font-semibold">1) Sustitución</p>
      <BlockMath
        math={`${a}w^2 ${b >= 0 ? "+" : ""}${b}w ${c >= 0 ? "+" : ""}${c} = 0`}
      />
    </div>
  );

  const D = b * b - 4 * a * c;
  steps.push(
    <div key="determinante">
      <p className="font-semibold">
        2) Determinante en <InlineMath math={`w`} />{" "}
      </p>
      <BlockMath
        math={`D=b^2-4ac=(${b})^2-4(${a})(${c})=${b * b}-${4 * a * c}=${D}`}
      />
    </div>
  );

  steps.push(
    <div key="FormulaGeneral">
      <p key="fg" className="font-semibold">
        3) Fórmula general en <InlineMath math={`w`} />{" "}
      </p>
      <BlockMath key="fg1" math={`w=\\frac{-b\\pm\\sqrt{D}}{2a}`} />
      <BlockMath
        key="fg2"
        math={`w=\\frac{-(${b})\\pm\\sqrt{${D}}}{2(${a})}`}
      />
    </div>
  );

  if (D < 0) {
    const AbsD = -D;
    const [s, r] = factorSquare(AbsD);
    const sqrtAbsD = sqrtDecompLatex(AbsD);
    steps.push(
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
          math={`=\\frac{${-b}\\pm ${sqrtAbsD}\\,i}{${2 * a}}=\\frac{-(${b}){${
            2 * a
          }}\\;\\pm\\;\\frac{${sqrtAbsD}}{${2 * a}}\\,i`}
        />
      </div>
    );
    const A = fracSimplifyLatex(-b, 2 * a);
    const Bi =
      r === 1
        ? fracSimplifyLatex(s, 2 * a)
        : `\\frac{${s}${r === 1 ? "" : `\\sqrt{${r}}`}}{${2 * a}}`;
    steps.push(<BlockMath key="wneg4" math={`w=${A}\\pm${Bi}\\,i`} />);
    steps.push(
      <p key="wneg5">
        Como \(w=x^2\) y \(w\) es complejo, entonces \(x\) será complejo (no
        real). Tomar \\(\\sqrt{}\\) compleja excede el nivel de este módulo.
      </p>
    );
    return steps;
  }

  const sqrtD = Math.sqrt(D);
  const twoA = 2 * a;

  const w1 = (-b + sqrtD) / twoA;
  const w2 = (-b - sqrtD) / twoA;
  const w1R = round2(w1);
  const w2R = round2(w2);
  steps.push(
    <div key="CalculoTitle">
      <p key="wcalc" className="font-semibold">
        4) Cálculo de <InlineMath math={`w_1`} /> y <InlineMath math={`w_2`} />
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
        <BlockMath math={` w_1 \\approx \\frac{-(${b}) + ${sqrtD}}{${twoA}}`} />
        <BlockMath math={` w_2 \\approx \\frac{-(${b}) - ${sqrtD}}{${twoA}}`} />
      </div>
      <div className="flex flex-row gap-8 items-center justify-center">
        <BlockMath
          math={`w_1 \\approx \\frac{${round2(-b + sqrtD)}}{${twoA}} = ${w1R}`}
        />
        <BlockMath
          math={`w_2 \\approx \\frac{${round2(-b - sqrtD)}}{${twoA}} = ${w2R}`}
        />
      </div>
    </div>
  );

  steps.push();

  if (w1R > 0) {
    steps.push(
      <div key="VolverAX">
        <p className="font-semibold">
          5) Volver a <InlineMath math={`x`} />: <InlineMath math={`x^2=w`} />
        </p>
        <BlockMath
          key="xw1_1"
          math={`x=\\pm\\sqrt{w_1}\\;=\\;\\pm\\sqrt{${w1R}}\\;\\approx\\;\\pm${round2(
            Math.sqrt(w1R)
          )}`}
        />
      </div>
    );
  } else if (w1R === 0) {
    steps.push(<BlockMath key="xw1_0" math={`x=0\\quad (de\\; w_1=0)`} />);
  } else {
    const absw = round2(Math.abs(w1R));
    steps.push(
      <BlockMath
        key="xw1_n1"
        math={`x=\\pm\\sqrt{${w1R}}=\\pm\\sqrt{${absw}\\cdot(-1)}`}
      />
    );
    steps.push(
      <BlockMath
        key="xw1_n2"
        math={`=\\pm\\sqrt{${absw}}\\sqrt{-1}=\\pm\\sqrt{${absw}}\\,i\\;\\approx\\;\\pm${round2(
          Math.sqrt(absw)
        )}\\,i`}
      />
    );
  }

  if (w2R > 0) {
    steps.push(
      <BlockMath
        key="xw2_1"
        math={`x=\\pm\\sqrt{w_2}\\;=\\;\\pm\\sqrt{${w2R}}\\;\\approx\\;\\pm${round2(
          Math.sqrt(w2R)
        )}`}
      />
    );
  } else if (w2R === 0) {
    steps.push(<BlockMath key="xw2_0" math={`x=0\\quad (de\\; w_2=0)`} />);
  } else {
    const absw = round2(Math.abs(w2R));
    steps.push(
      <BlockMath
        key="xw2_n1"
        math={`x=\\pm\\sqrt{${w2R}}=\\pm\\sqrt{${absw}\\cdot(-1)}`}
      />
    );
    steps.push(
      <BlockMath
        key="xw2_n2"
        math={`=\\pm\\sqrt{${absw}}\\sqrt{-1}=\\pm\\sqrt{${absw}}\\,i\\;\\approx\\;\\pm${round2(
          Math.sqrt(absw)
        )}\\,i`}
      />
    );
  }

  return steps;
};
