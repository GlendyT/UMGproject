import { JSX } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { QuadraticSolverProps } from "../types";

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

  const D = b * b - 4 * a * c;
  const twoA = 2 * a;
  const AbsD = -D;
  const [s, r] = factorSquare(AbsD);
  const sqrtAbsD = sqrtDecompLatex(AbsD);
  const A = fracSimplifyLatex(-b, twoA);
  const B =
    r === 1 ? fracSimplifyLatex(s, twoA) : `\\frac{${s}\\sqrt{${r}}}{${twoA}}`;
  const sqrtD = Math.sqrt(D);
  const sqrtDsym = isPerfectSquare(D) ? String(sqrtD) : `\\sqrt{${D}}`;
  const x1 = fracSimplifyLatex(-b + sqrtD, twoA);
  const x2 = fracSimplifyLatex(-b - sqrtD, twoA);
  steps.push(
    <div
      key="container"
      className="flex flex-wrap items-start justify-center w-full gap-2"
    >
      <div
        key="t2"
        className="flex flex-col items-center justify-center border rounded-2xl p-4 w-auto"
      >
        Resolver:
        <InlineMath math={equation} />
        Identificamos: <InlineMath math={`a=${a},\\;b=${b},\\;c=${c}`} />{" "}
      </div>
      <div
        key="d4"
        className="font-semibold flex flex-col border rounded-2xl p-4 w-auto"
      >
        1) Determinante <BlockMath math={`D=b^2-4ac`} />
        <BlockMath math={`=(${b})^2-4(${a})(${c})`} />
        <BlockMath math={`=${b * b}-${4 * a * c}`} />
        <BlockMath math={`Determinante=${D}`} />
        {D < 0
          ? "No tiene soluciones reales; sí tiene soluciones complejas."
          : "Tiene soluciones reales."}
      </div>
      <div
        key="f"
        className="font-semibold flex flex-col border rounded-2xl p-4 w-auto "
      >
        2) Aplicar la fórmula cuadrática
        <BlockMath key="f1" math={`x=\\frac{-b\\pm\\sqrt{D}}{2a}`} />
        <BlockMath
          key="f2"
          math={`x=\\frac{-(${b})\\pm\\sqrt{${D}}}{2(${a})}`}
        />
        {D < 0 ? (
          <div className="flex flex-col w-full ">
            <BlockMath
              math={`=\\frac{${-b}\\pm\\sqrt{${AbsD}\\cdot(-1)}}{${twoA}}`}
            />
            <BlockMath
              math={`=\\frac{${-b}\\pm${sqrtAbsD}\\sqrt{-1}}{${twoA}}`}
            />
            <BlockMath math={`=\\frac{${-b}\\pm${sqrtAbsD}\\,i}{${twoA}}`} />{" "}
            <BlockMath
              math={`=\\frac{${-b}}{${twoA}}\\;\\pm\\;\\frac{${sqrtAbsD}}{${twoA}}\\,i`}
            />
          </div>
        ) : (
          <>
            <BlockMath
              key="r1"
              math={`=\\frac{${-b}\\pm${sqrtDsym}}{${twoA}}`}
            />
            {isPerfectSquare(D) ? (
              <>
                <BlockMath
                  key="r2"
                  math={`x_1=\\frac{${-b}+${sqrtD}}{${twoA}}\\;,\\;x_2=\\frac{${-b}-${sqrtD}}{${twoA}}`}
                />
                <BlockMath key="r3" math={`x=${x1}\\;,\\;x=${x2}`} />
              </>
            ) : (
              <p key="rad">
                La raíz no es entera; se deja en forma radical exacta.
              </p>
            )}
          </>
        )}
      </div>
      <div className="font-semibold flex flex-col border rounded-2xl p-4 w-auto ">
        {" "}
        {D < 0 && (
          <>
            {" "}
            Resultado:
            <BlockMath key="c5" math={`x=${A}\\;\\pm\\;${B}\\,i`} />{" "}
            <BlockMath
              key="c6"
              math={`x=${A}+${B}\\,i\\;,\\;\\;x=${A}-${B}\\,i`}
            />{" "}
          </>
        )}
      </div>
    </div>
  );

  return steps;
};
