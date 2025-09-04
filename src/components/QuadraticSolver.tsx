import { JSX } from "react";
import { BlockMath, InlineMath } from "react-katex";

interface QuadraticSolverProps {
  equation: string;
  a: number;
  b: number;
  c: number;
  factorSquare: (n: number) => [number, number];
  sqrtDecompLatex: (n: number) => string;
  fracSimplifyLatex: (num: number, den: number) => string;
  isPerfectSquare: (n: number) => boolean;
}

export const QuadraticSolver = ({
  equation,
  a,
  b,
  c,
  factorSquare,
  sqrtDecompLatex,
  fracSimplifyLatex,
  isPerfectSquare,
}: QuadraticSolverProps) => {
  const steps: JSX.Element[] = [];

  steps.push(
    <div key="t2" className="flex flex-col">
      Resolver:
      <InlineMath math={equation} />
      Identificamos: <InlineMath math={`a=${a},\\;b=${b},\\;c=${c}`} />{" "}
    </div>
  );

  const D = b * b - 4 * a * c;
  steps.push(
    <div key="d4" className="font-semibold">
      1) Determinante{" "}
      <BlockMath
        key="d5"
        math={`D=b^2-4ac=(${b})^2-4(${a})(${c})=${b * b}-${4 * a * c}=${D}`}
      />
      {D < 0
        ? "No tiene soluciones reales; sí tiene soluciones complejas."
        : "Tiene soluciones reales."}
    </div>
  );

  const twoA = 2 * a;
  steps.push(
    <div key="f" className="font-semibold">
      2) Aplicar la fórmula cuadrática
      <BlockMath key="f1" math={`x=\\frac{-b\\pm\\sqrt{D}}{2a}`} />
      <BlockMath key="f2" math={`x=\\frac{-(${b})\\pm\\sqrt{${D}}}{2(${a})}`} />
    </div>
  );

  if (D < 0) {
    const AbsD = -D;
    const [s, r] = factorSquare(AbsD);
    const sqrtAbsD = sqrtDecompLatex(AbsD);
    steps.push(
      <div key="AplicarFormulaCuadratica">
        <BlockMath

          math={`=\\frac{${-b}\\pm\\sqrt{${AbsD}\\cdot(-1)}}{${twoA}}`}
        />
        <BlockMath

          math={`=\\frac{${-b}\\pm${sqrtAbsD}\\sqrt{-1}}{${twoA}}`}
        />
        <BlockMath

          math={`=\\frac{${-b}\\pm${sqrtAbsD}\\,i}{${twoA}}`}
        />{" "}
        <BlockMath

          math={`=\\frac{${-b}}{${twoA}}\\;\\pm\\;\\frac{${sqrtAbsD}}{${twoA}}\\,i`}
        />
      </div>
    );

    const A = fracSimplifyLatex(-b, twoA);
    const B =
      r === 1
        ? fracSimplifyLatex(s, twoA)
        : `\\frac{${s}\\sqrt{${r}}}{${twoA}}`;
    steps.push(<BlockMath key="c5" math={`x=${A}\\;\\pm\\;${B}\\,i`} />);
    steps.push(
      <BlockMath key="c6" math={`x=${A}+${B}\\,i\\;,\\;\\;x=${A}-${B}\\,i`} />
    );
  } else {
    const sqrtD = Math.sqrt(D);
    const sqrtDsym = isPerfectSquare(D) ? String(sqrtD) : `\\sqrt{${D}}`;
    steps.push(
      <BlockMath key="r1" math={`=\\frac{${-b}\\pm${sqrtDsym}}{${twoA}}`} />
    );

    if (isPerfectSquare(D)) {
      const x1 = fracSimplifyLatex(-b + sqrtD, twoA);
      const x2 = fracSimplifyLatex(-b - sqrtD, twoA);
      steps.push(
        <BlockMath
          key="r2"
          math={`x_1=\\frac{${-b}+${sqrtD}}{${twoA}}\\;,\\;x_2=\\frac{${-b}-${sqrtD}}{${twoA}}`}
        />
      );
      steps.push(<BlockMath key="r3" math={`x=${x1}\\;,\\;x=${x2}`} />);
    } else {
      steps.push(
        <p key="rad">La raíz no es entera; se deja en forma radical exacta.</p>
      );
    }
  }

  return steps;
};
