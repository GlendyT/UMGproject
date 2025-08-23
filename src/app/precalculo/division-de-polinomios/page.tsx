"use client";
import React, { useMemo, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";


const EPS = 1e-12;

function trimLeadingZeros(a: number[]): number[] {
  const out = [...a];
  while (out.length > 1 && Math.abs(out[0]) < EPS) out.shift();
  return out;
}

function parsePolynomialDescending(src: string): number[] {
  const s = src.replace(/\s+/g, "");
  if (!s) return [0];

  // separa en términos, manejando signos
  const parts = s.replace(/-/g, "+-").split("+").filter(Boolean);

  // mapa grado -> coef
  const map = new Map<number, number>();
  for (const t of parts) {
    // patrones: ax^n, ax, x^n, x, c
    const m = t.match(/^([+-]?\d*(?:\.\d+)?)?(x)?(?:\^(\d+))?$/);
    if (!m) continue;

    const [, rawCoef, hasX, rawExp] = m;
    let coef: number;
    let exp: number;

    if (hasX) {
      exp = rawExp ? parseInt(rawExp, 10) : 1;
      if (rawCoef === "" || rawCoef === "+" || rawCoef === undefined) coef = 1;
      else if (rawCoef === "-") coef = -1;
      else coef = Number(rawCoef);
    } else {
      exp = 0;
      coef = rawCoef ? Number(rawCoef) : 0;
    }

    if (!Number.isFinite(coef)) coef = 0;
    map.set(exp, (map.get(exp) || 0) + coef);
  }

  const maxDeg = Math.max(0, ...Array.from(map.keys()));
  const arr: number[] = [];
  for (let d = maxDeg; d >= 0; d--) arr.push(map.get(d) || 0);
  return trimLeadingZeros(arr);
}

function coeffsToLatexDESC(coeffs: number[]): string {
  const n = coeffs.length;
  if (n === 0) return "0";

  let out = "";
  for (let i = 0; i < n; i++) {
    const c = coeffs[i];
    if (Math.abs(c) < EPS) continue;
    const pow = n - 1 - i;

    // signo
    const sign = c < 0 ? "-" : out ? "+" : "";
    const absC = Math.abs(c);

    if (pow === 0) {
      out += `${sign}${absC}`;
    } else if (pow === 1) {
      if (Math.abs(absC - 1) < EPS) out += `${sign}x`;
      else out += `${sign}${absC}x`;
    } else {
      if (Math.abs(absC - 1) < EPS) out += `${sign}x^{${pow}}`;
      else out += `${sign}${absC}x^{${pow}}`;
    }
  }
  return out || "0";
}

/** resta A - B (ambos DESC) */
function subtractDESC(A: number[], B: number[]): number[] {
  const n = Math.max(A.length, B.length);
  const a = [...A];
  const b = [...B];
  while (a.length < n) a.unshift(0);
  while (b.length < n) b.unshift(0);
  const res = a.map((v, i) => v - b[i]);
  return trimLeadingZeros(res);
}

/** multiplica polinomio DESC por escalar */
function scaleDESC(poly: number[], k: number): number[] {
  return poly.map((c) => c * k);
}

/** "desplaza" (multiplica por x^k) en DESC: añadir k ceros AL FINAL */
function shiftDESC(poly: number[], k: number): number[] {
  if (k <= 0) return [...poly];
  return [...poly, ...Array(k).fill(0)];
}

/** =========================
 *  División larga segura (DESC)
 *  =========================
 */
type Step = {
  subtrahend: number[]; // divisor*c, desplazado
  remainder: number[]; // resto tras la resta
};

function longDivisionDESC(
  dividend: number[],
  divisor: number[],
  maxIterations = 200
) {
  if (divisor.length === 0 || Math.abs(divisor[0]) < EPS) {
    throw new Error("El divisor no puede ser 0.");
  }

  let R = trimLeadingZeros(dividend);
  const D = trimLeadingZeros(divisor);

  const degR = () => R.length - 1;
  const degD = D.length - 1;

  const qLen = Math.max(0, degR() - degD + 1);
  const Q = Array(qLen).fill(0); // DESC (grado máximo a mínimo)

  const steps: Step[] = [];
  let guard = 0;

  while (R.length >= D.length && guard < maxIterations) {
    guard++;

    const k = R.length - D.length; // diferencia de grados
    const c = R[0] / D[0]; // coef término del cociente
    const qIndex = Q.length - 1 - k; // coloca en posición DESC correcta
    if (qIndex >= 0 && qIndex < Q.length) Q[qIndex] += c;

    // divisor * c, luego desplazar por k
    const sub = shiftDESC(scaleDESC(D, c), k);

    // R <- R - sub
    const newR = subtractDESC(R, sub);

    steps.push({ subtrahend: sub, remainder: newR });
    if (newR.length < R.length || degR() < degD) {
      R = newR;
    } else {
      // si no reduce el grado, evitamos loop
      R = newR.length ? newR.slice(1) : [0];
    }

    if (R.length < D.length) break;
  }

  return {
    quotient: trimLeadingZeros(Q),
    remainder: trimLeadingZeros(R),
    steps,
  };
}

/** =========================
 *  Componente principal
 *  =========================
 */
const PolynomialDivision: React.FC = () => {
  const [P, setP] = useState("8x^4+6x^2-3x+1");
  const [D, setD] = useState("2x^2-x+2");

  const VISIBLE_STEPS = 3; // estructura fija como tu imagen

  const { dividend, divisor, result, error } = useMemo(() => {
    try {
      const dividend = parsePolynomialDescending(P);
      const divisor = parsePolynomialDescending(D);

      if (divisor.length === 0 || Math.abs(divisor[0]) < EPS) {
        return {
          dividend,
          divisor,
          result: null,
          error: "El divisor no puede ser 0.",
        };
      }

      const result = longDivisionDESC(dividend, divisor);
      return { dividend, divisor, result, error: null };
    } catch (e: unknown) {
      return {
        dividend: [0],
        divisor: [1],
        result: null,
        error: e instanceof Error ? e.message : "Error al dividir.",
      };
    }
  }, [P, D]);

  const quotientLatex = result ? coeffsToLatexDESC(result.quotient) : "0";
  const remainderLatex = result ? coeffsToLatexDESC(result.remainder) : "0";

  return (
    <div className="p-6 text-neutral-900 bg-white min-h-screen font-serif">
      <h2 className="text-xl font-bold mb-4">División larga de polinomios</h2>

      {/* Inputs */}
      <div className="mb-4 flex flex-wrap gap-4">
        <label className="text-sm">
          P(x):
          <input
            className="ml-2 text-black px-2 py-1 rounded"
            value={P}
            onChange={(e) => setP(e.target.value)}
            placeholder="Ej: 8x^4+6x^2-3x+1"
          />
        </label>
        <label className="text-sm">
          D(x):
          <input
            className="ml-2 text-black px-2 py-1 rounded"
            value={D}
            onChange={(e) => setD(e.target.value)}
            placeholder="Ej: 2x^2-x+2"
          />
        </label>
      </div>

      {/* Enunciado */}
      <p className="mb-4">
        Sean <InlineMath math={`P(x) = ${coeffsToLatexDESC(dividend)}`} /> y{" "}
        <InlineMath math={`D(x) = ${coeffsToLatexDESC(divisor)}`} />,<br />{" "}
        encuentre <InlineMath math="Q(x)" /> y <InlineMath math="R(x)" />
        <br />
        tales que <InlineMath math="P(x) = D(x)\,Q(x) + R(x)" />.
      </p>

      {error && <div className="mb-4 text-red-400">{error}</div>}

      {/* ====== Tabla con estructura fija como la imagen ====== */}
      {result && (
        <div className="overflow-x-auto">
          <table className="table-auto border border-gray-500 mx-auto text-lg">
            <tbody>
              <tr>
                {/* Columna izquierda: Divisor */}
                <td className="px-4 py-2 text-center align-top border border-gray-500">
                  <BlockMath math={coeffsToLatexDESC(divisor)} />
                </td>

                {/* Columna central: Dividendo y pasos (hasta VISIBLE_STEPS) */}
                <td className="px-4 py-2 text-left border border-gray-500">
                  {/* Dividend o inicial */}
                  <BlockMath math={coeffsToLatexDESC(dividend)} />
                  {/* Pasos */}
                  {result.steps.slice(0, VISIBLE_STEPS).map((s, i) => (
                    <div key={i}>
                      <BlockMath
                        math={`-\\left(${coeffsToLatexDESC(
                          s.subtrahend
                        )}\\right)`}
                      />
                      <BlockMath math={coeffsToLatexDESC(s.remainder)} />
                    </div>
                  ))}
                </td>

                {/* Columna derecha: Cociente (arriba) y Residuo (abajo) */}
                <td className="px-4 py-2 font-bold border border-gray-500 align-top">
                  <div>
                    <BlockMath math={quotientLatex} />
                  </div>
                  <div className="mt-8">
                    <BlockMath math={remainderLatex} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Resultado final */}
          <div className="mt-6 text-center text-xl">
            <BlockMath
              math={`P(x) = \\left(${coeffsToLatexDESC(
                divisor
              )}\\right)\\left(${quotientLatex}\\right)+\\left(${remainderLatex}\\right)`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PolynomialDivision;
