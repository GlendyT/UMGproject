"use client"
import React, { useMemo, useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

/** ---------- Utilidades matemáticas ---------- **/

//const sgn = (n: number) => (n < 0 ? "-" : "");
const abs = (n: number) => Math.abs(n);

function hornerEval(coeffs: number[], x: number): number {
  return coeffs.reduce((acc, c) => acc * x + c, 0);
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a || 1;
}

function gcdArray(arr: number[]): number {
  return arr.reduce((g, v) => gcd(g, v), 0);
}

function factors(n: number): number[] {
  n = Math.abs(n);
  if (n === 0) return [0];
  const out = new Set<number>();
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      out.add(i);
      out.add(n / i);
    }
  }
  return Array.from(out).sort((a, b) => a - b);
}

function reduceFraction(p: number, q: number): [number, number] {
  if (q === 0) return [p, q];
  const g = gcd(p, q);
  const qq = q / g;
  const pp = p / g;
  return qq < 0 ? [-pp, -qq] : [pp, qq];
}

function toFracLatex(n: number): string {
  // muestra enteros como 2 y fracciones como \tfrac{3}{2}
  if (Number.isInteger(n)) return `${n}`;
  const s = Math.sign(n);
  const [p, q] = reduceFraction(abs(Math.round(n * 1e9)), 1e9); // robusto
  const sp = s < 0 ? "-" : "";
  return `${sp}\\tfrac{${p}}{${q}}`;
}

function candidatesByRRT(constant: number, leading: number): { p: number[]; q: number[]; list: number[] } {
  const p = factors(constant);
  const q = factors(leading);
  // Genera ±p/q en el orden visual de la imagen: p ascendente, q = 1 luego el resto
  const list: number[] = [];
  const qOrdered = Array.from(new Set([1, ...q.filter((x) => x !== 1)]));

  for (const pi of p) {
    for (const qi of qOrdered) {
      const r = pi / qi;
      list.push(r, -r);
    }
  }
  // Únicos preservando orden aproximado
  const seen = new Set<string>();
  const uniq: number[] = [];
  for (const v of list) {
    const key = reduceFraction(Math.round(v * 1e9), 1e9).join("/");
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(v);
    }
  }
  return { p, q, list: uniq };
}

type SynStep = {
  divisor: number;                // r
  top: number[];                  // coeficientes de entrada
  middle: number[];               // productos acumulados
  bottom: number[];               // fila resultado (sin el residuo)
  remainder: number;              // debe ser 0 si es raíz
};

/** División sintética con fila intermedia explícita */
function syntheticDivision(coeffs: number[], r: number): SynStep {
  const top = coeffs.slice();
  const n = coeffs.length;
  const middle: number[] = [];
  const bottom: number[] = [];
  let carry = top[0];
  bottom.push(carry);

  for (let i = 1; i < n; i++) {
    const prod = carry * r;
    middle.push(prod);
    const next = prod + top[i];
    bottom.push(next);
    carry = next;
  }
  const remainder = bottom.pop()!; // último es el residuo
  return { divisor: r, top, middle, bottom, remainder };
}

function polyToLatex(coeffs: number[]): string {
  // En forma descendente
  const out: string[] = [];
  const deg = coeffs.length - 1;
  for (let i = 0; i < coeffs.length; i++) {
    const c = coeffs[i];
    const e = deg - i;
    if (c === 0) continue;
    const sign = c > 0 ? (out.length ? "+" : "") : "-";
    const absc = Math.abs(c);
    const coeff =
      (absc === 1 && e !== 0 ? "" : `${absc}`) + (e === 0 ? "" : e === 1 ? "x" : `x^{${e}}`);
    out.push(`${sign}${coeff}`);
  }
  if (out.length === 0) return "0";
  return out.join(" ");
}

function linFactorLatex(r: number): string {
  // (x - r) en LaTeX, con fracción si hace falta
  if (Number.isInteger(r)) return `(x ${r >= 0 ? "-" : "+"} ${abs(r)})`;
  const [p, q] = reduceFraction(Math.round(abs(r) * 1e9), 1e9);
  const s = r >= 0 ? "-" : "+";
  return `(x ${s} \\tfrac{${p}}{${q}})`;
}

/** Intenta factorizar cuadrático monico/entero en (x+m)(x+n) */
function factorQuadraticInt(a: number, b: number, c: number): null | [number, number] {
  if (a === 0) return null;
  // Sólo manejamos monicos o a con factores enteros simples
  if (a !== 1) {
    // reescala si a divide a b y c
    const g = gcd(gcd(a, b), c);
    if (g !== 1) {
      a /= g; b /= g; c /= g;
    }
  }
  if (a !== 1) return null;
  for (let m = -Math.abs(c) - 1; m <= Math.abs(c) + 1; m++) {
    const n = c / (m || 1);
    if (!Number.isInteger(n)) continue;
    if (m + n === b && m * n === c) return [m, n];
  }
  return null;
}

/** ---------- Componente principal ---------- **/

export default function Ejemplo2Dinamico() {
  const [input, setInput] = useState("2x^5+5x^4-8x^3-14x^2+6x+9");
  const [run, setRun] = useState(0);

  // Parseo: convierte string a coeficientes (grado descendente)
  const parsePolynomial = (s: string): number[] => {
    const cleaned = s.replace(/\s+/g, "");
    const termRe = /([+-]?\d*)x\^?(\d+)?|([+-]?\d+)/g;
    const terms: { c: number; e: number }[] = [];
    for (const m of cleaned.matchAll(termRe)) {
      if (m[1] !== undefined && m[1] !== "") {
        const coef = m[1] === "+" || m[1] === "" ? 1 : m[1] === "-" ? -1 : parseInt(m[1], 10);
        const exp = m[2] ? parseInt(m[2], 10) : 1;
        terms.push({ c: coef, e: exp });
      } else if (m[1] === "" && m[2]) {
        // caso "x^k" sin coef
        terms.push({ c: 1, e: parseInt(m[2], 10) });
      } else if (m[3] != null) {
        terms.push({ c: parseInt(m[3], 10), e: 0 });
      }
    }
    if (terms.length === 0) return [0];
    const maxE = Math.max(...terms.map((t) => t.e));
    const coeffs = Array(maxE + 1).fill(0);
    for (const t of terms) coeffs[maxE - t.e] = (coeffs[maxE - t.e] || 0) + t.c;
    return coeffs;
  };

  const data = useMemo(() => {
    const coeffs0 = parsePolynomial(input);
    const leading = coeffs0[0];
    const constant = coeffs0[coeffs0.length - 1];

    const { p, q, list } = candidatesByRRT(constant, leading);

    // Factorización por raíces racionales (mostramos sólo los intentos que funcionan, como en las imágenes)
    const synSteps: SynStep[] = [];
    let coeffs = coeffs0.slice();
    const foundRoots: number[] = [];
    const integralizedPairs: Array<{ combined: boolean; r: number; gUsed: number }> = [];

    // mientras grado >= 3 intentamos encontrar raíces racionales
    while (coeffs.length > 3) {
      let chosen: number | null = null;

      // probamos positivos primero, luego negativos (se parece al flujo de la imagen)
      const ordered = [
        ...list.filter((x) => x > 0),
        ...list.filter((x) => x < 0),
      ];

      for (const r of ordered) {
        if (hornerEval(coeffs, r) === 0) {
          chosen = r;
          break;
        }
      }
      if (chosen == null) break;

      const step = syntheticDivision(coeffs, chosen);
      synSteps.push(step);
      foundRoots.push(chosen);

      // Nuevo cociente
      const newCoeffs = step.bottom.slice(); // grado baja en 1

      // Revisamos si podemos replicar el paso "sacar MCD y combinar con el factor racional"
      // como en la segunda imagen (2 * (x - 3/2) -> (2x - 3))
      let combined = false;
      let gUsed = 1;
      const g = gcdArray(newCoeffs);
      if (!Number.isInteger(chosen)) {
        const [ qden] = reduceFraction(
          Math.round(Math.abs(chosen) * 1e9),
          1e9
        );
        // Si g es múltiplo de q, podemos mostrar los DOS pasos intermedios y combinar
        if (g % qden === 0) {
          combined = true;
          gUsed = qden; // combinaremos exactamente "q" (como en 2 * (x - 3/2))
        }
      }
      integralizedPairs.push({ combined, r: chosen, gUsed });

      // si hubo combinación completa, dividimos todos los coeficientes por gUsed (para mostrar Q' monico como en la imagen)
      if (combined) {
        for (let i = 0; i < newCoeffs.length; i++) newCoeffs[i] /= gUsed;
      }

      coeffs = newCoeffs;
    }

    // Si queda cúbico, intentamos una raíz racional más
    if (coeffs.length === 4) {
      const { list: list2 } = candidatesByRRT(coeffs[coeffs.length - 1], coeffs[0]);
      const ordered2 = [...list2.filter((x) => x > 0), ...list2.filter((x) => x < 0)];
      let chosen: number | null = null;
      for (const r of ordered2) {
        if (hornerEval(coeffs, r) === 0) {
          chosen = r;
          break;
        }
      }
      if (chosen != null) {
        const step = syntheticDivision(coeffs, chosen);
        synSteps.push(step);
        foundRoots.push(chosen);
        coeffs = step.bottom.slice();
        integralizedPairs.push({ combined: false, r: chosen, gUsed: 1 });
      }
    }

    // En este punto coeffs es cuadrático (o menor)
    const finalQuad = coeffs.length === 3 ? coeffs.slice() : null;

    // ¿Todos positivos para la NOTA de cota superior?
    const upperBoundNoteIndex = synSteps.findIndex(
      (s) => s.remainder === 0 && s.bottom.every((v) => v > 0)
    );

    // Construimos las cadenas LaTeX de P(x) paso a paso
    //const P0 = `P(x) = ${polyToLatex(parsePolynomial(input))}`;
    const partials: string[] = [];

    // Producto de factores lineales encontrados hasta cada paso + cociente
    //const remainingPoly = parsePolynomial(input);
    const factPrefix: string[] = [];
    //const scaleAccum = 1;

    for (let i = 0; i < synSteps.length; i++) {
      const st = synSteps[i];
      const r = foundRoots[i];

      // 1) P(x) = (factores previos) (x - r) * Q(x)   [Q = cociente directo]
      //const Q1 = polyToLatex(st.bottom.concat(st.remainder)); // fila inferior + residuo -> recupera cociente+residuo
    //  const Qcoeffs = st.bottom.concat(st.remainder);
      // pero queremos el cociente sin el residuo, polinomio de grado-1:
      const quotient = st.bottom.slice();
      const Qlatex = polyToLatex(quotient);

      const factorLatex = linFactorLatex(r);
      const prefix = factPrefix.length ? `${factPrefix.join("")}` : "";
      partials.push(
        `P(x) = ${prefix}${factorLatex}\\left(${Qlatex}\\right)`
      );

      // 2) Si se puede, mostramos sacar MCD del cociente y combinar g*(x-p/q)
      if (!Number.isInteger(r)) {
        const [pp, qq] = reduceFraction(
          Math.round(Math.abs(r) * 1e9),
          1e9
        );
        const gQ = gcdArray(quotient);
        if (gQ > 1) {
          // Mostrar: P(x) = (...) (x - p/q) g (Q/g)
          const Qdiv = quotient.map((c) => c / gQ);
          partials.push(
            `P(x) = ${prefix}${factorLatex}\\,${gQ}\\left(${polyToLatex(Qdiv)}\\right)`
          );
          // ¿Se puede combinar como en la imagen?
          if (gQ % qq === 0) {
            const k = gQ / qq; // si k==1, coincide exactamente con el ejemplo
            const sign = r >= 0 ? "-" : "+";
            const combined = k === 1
              ? `(${qq}x ${sign} ${pp})`
              : `${k}\\,(${qq}x ${sign} ${pp})`;
            partials.push(
              `P(x) = ${prefix}${combined}\\left(${polyToLatex(Qdiv)}\\right)`
            );
            // aplicamos combinación a nuestro "prefix" para pasos siguientes
            factPrefix.push(combined);
          } else {
            // no combinable limpio: dejamos g fuera y seguimos con (x - p/q)
            factPrefix.push(`${factorLatex}${gQ === 1 ? "" : `\\,${gQ}`}`);
          }
        } else {
          factPrefix.push(factorLatex);
        }
      } else {
        factPrefix.push(factorLatex);
      }

      // actualizamos remainingPoly para siguiente vuelta
      //remainingPoly = quotient;
    }

    // Si nos queda cuadrático, mostramos la parte de la "caja azul"
    let quadBox:
      | { eqLine: string; factLine?: string; factorsLatex?: string }
      | null = null;

    if (finalQuad) {
      const [a, b, c] = finalQuad;
      const quadLatex = polyToLatex(finalQuad);
      const factInt = factorQuadraticInt(a, b, c);
      if (factInt) {
        const [m, n] = factInt;
        const f1 = `(x ${m >= 0 ? "+" : "-"} ${abs(m)})`;
        const f2 = `(x ${n >= 0 ? "+" : "-"} ${abs(n)})`;
        quadBox = {
          eqLine: `\\left(${quadLatex}\\right)=0`,
          factLine: `${f1}${f2}=0`,
          factorsLatex: `${f1}${f2}`,
        };
      } else {
        quadBox = {
          eqLine: `\\left(${quadLatex}\\right)=0`,
        };
      }
    }

    // Construimos factorización final
    const linearFactors = foundRoots.map(linFactorLatex);
    let finalLatex = "";
    if (finalQuad) {
      // si factorizó, usamos factorBox; si no, dejamos el cuadrático
      const last =
        quadBox?.factorsLatex ?? `\\left(${polyToLatex(finalQuad)}\\right)`;
      finalLatex = `${linearFactors.join("")}${last}`;
    } else {
      finalLatex = `${linearFactors.join("")}`;
    }

    return {
      coeffs0,
      p, q, list,
      synSteps,
      upperBoundNoteIndex,
      partials,
      quadBox,
      finalLatex,
    };
  }, [input]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-bold">Ejemplo 2:</h2>
      <p className="leading-relaxed">
        Factorice completamente la función polinomial{" "}
        <InlineMath math={`P(x) = ${polyToLatex(parsePolynomial(input))}`} />
      </p>

      <div className="rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold">1. Aplicar el teorema de los ceros racionales</h3>
        <p>
          <InlineMath
            math={`p = ${abs(data.coeffs0[data.coeffs0.length - 1])} = \\pm ${data.p.join(",\\, \\pm ")}`}
          />
        </p>
        <p>
          <InlineMath
            math={`q = ${abs(data.coeffs0[0])} = \\pm ${data.q.join(",\\, \\pm ")}`}
          />
        </p>
        <p>
          <InlineMath
            math={`\\dfrac{p}{q} = ${data.list
              .map((r) => toFracLatex(r))
              .join(",\\, ")}`}
          />
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-semibold">
          2. Aplicar división sintética para{" "}
          <InlineMath math={`P(x)=${polyToLatex(data.coeffs0)}`} />
        </h3>

        {/* Entrada + botón */}
        <div className="flex gap-2 items-center">
          <input
            className="border rounded px-3 py-2 w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un polinomio, p.ej.: 2x^5+5x^4-8x^3-14x^2+6x+9"
          />
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => setRun((n) => n + 1)}
          >
            Factorizar
          </button>
        </div>

        {/* Tablas de división sintética (sólo pasos exitosos) */}
        {data.synSteps.map((s, i) => {
          const rLatex = toFracLatex(s.divisor);
          return (
            <div key={i} className="space-y-2">
              <p>
                Probando con <InlineMath math={`x = ${rLatex}`} />
              </p>

              <div className="inline-block rounded-lg overflow-hidden border">
                <table className="border-collapse text-sm">
                  <tbody>
                    <tr>
                      <td className="border px-3 py-2 text-center bg-gray-50 w-10">
                        <InlineMath math={rLatex} />
                      </td>
                      {s.top.map((c, idx) => (
                        <td key={idx} className="border px-3 py-2 text-center">
                          {c}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border px-3 py-2 text-center bg-gray-50" />
                      <td className="border px-3 py-2 text-center"> </td>
                      {s.middle.map((c, idx) => (
                        <td key={idx} className="border px-3 py-2 text-center">
                          {c}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border px-3 py-2 text-center bg-gray-50" />
                      {s.bottom.map((c, idx) => (
                        <td key={idx} className="border px-3 py-2 text-center">
                          {c}
                        </td>
                      ))}
                      <td className="border px-3 py-2 text-center">{s.remainder}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <InlineMath math={`x = ${rLatex}`} /> sí es cero del polinomio, por lo tanto, este factor es{" "}
                <InlineMath math={`${linFactorLatex(s.divisor)}`} />.
              </p>

              {/* NOTA (cota superior) exactamente cuando corresponde */}
              {data.upperBoundNoteIndex === i && (
                <p className="text-sm">
                  <b>NOTA:</b> observe que el cociente presenta todos sus coeficientes positivos, por lo tanto,{" "}
                  <InlineMath math={`x = ${rLatex}`} /> es el límite superior de los posibles ceros del polinomio, lo que quiere decir que, ya no se deben evaluar valores mayores a este.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Cadena de igualdades como en la segunda imagen */}
      {data.partials.length > 0 && (
        <div className="space-y-2">
          {data.partials.map((eq, i) => (
            <BlockMath key={i} math={eq} />
          ))}
        </div>
      )}

      {/* Prueba adicional (cuando todavía queda un cúbico y hallamos otra raíz) ya incluida arriba.
          Ahora la "caja azul": factorizar el cuadrático final */}
      {data.quadBox && (
        <div className="p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.35)" }}>
          <div className="space-y-1">
            <BlockMath math={data.quadBox.eqLine} />
            {data.quadBox.factLine && <BlockMath math={data.quadBox.factLine} />}
          </div>
        </div>
      )}

      {/* Producto final exactamente como al final de la imagen */}
      {data.finalLatex && (
        <>
          <BlockMath math={`P(x) = ${data.finalLatex}`} />
          {/* Si hay factor repetido podemos mostrarlo con potencia compacta */}
          <div className="font-bold">
            <InlineMath math={`\\text{R:// el polinomio totalmente factorizado es } P(x) = ${data.finalLatex}`} />
          </div>
        </>
      )}
    </div>
  );
}
