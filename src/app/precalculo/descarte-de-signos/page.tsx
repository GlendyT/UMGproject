"use client";

import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

// Componente dinámico que reproduce paso a paso (exacto) el procedimiento
// de la imagen: teorema del factor racional, p/q sin simplificar, regla de
// Descartes para positivos (con flechas y colores), sustitución P(-x) y
// reducción mostrando los cambios de signo con color y flechas.

type Term = { exp: number; coef: number };

function parseNumber(raw: string): number {
  const s = raw.replace(/[()]/g, "").replace(/\+/g, "");
  if (s === "" || s === "+") return 1;
  if (s === "-") return -1;
  if (s.includes("/")) {
    const [a, b] = s.split("/");
    return Number(a) / Number(b);
  }
  return Number(s);
}

function getCoeffsFromPolynomial(input: string) {
  // Normalizar entrada
  let s = input.replace(/\s+/g, "");
  if (s === "") return { coeffs: [0], degree: 0 };

  // Asegurarnos que empieza con + o - para parsear más fácil
  if (!/^\+|^-/.test(s)) s = "+" + s;

  const re = /([+-])([^+-]+)/g;
  let m: RegExpExecArray | null;
  const map = new Map<number, number>();

  while ((m = re.exec(s)) !== null) {
    const sign = m[1];
    let term = m[2];
    // eliminar multiplicaciones explícitas
    term = term.replace(/\*/g, "");

    if (term.includes("x") || term.includes("X")) {
      // término con x
      // encontrar posición de x (normalizamos a minúscula)
      term = term.replace(/X/g, "x");
      const idx = term.indexOf("x");
      let coefStr = term.substring(0, idx);
      if (coefStr === "" || coefStr === "+") coefStr = "1";
      if (coefStr === "-") coefStr = "1"; // el signo lo tomamos desde `sign`

      // potencia
      let exp = 1;
      const powIdx = term.indexOf("^");
      if (powIdx !== -1) {
        exp = parseInt(term.substring(powIdx + 1), 10);
      }

      const coef = parseNumber(coefStr) * (sign === "-" ? -1 : 1);
      map.set(exp, (map.get(exp) || 0) + coef);
    } else {
      // término independiente
      const val = parseNumber(term) * (sign === "-" ? -1 : 1);
      map.set(0, (map.get(0) || 0) + val);
    }
  }

  const exps = Array.from(map.keys());
  const degree = exps.length ? Math.max(...exps) : 0;
  const coeffs: number[] = [];
  for (let e = degree; e >= 0; e--) {
    coeffs.push(map.get(e) || 0);
  }

  return { coeffs, degree };
}

function divisors(n: number) {
  const absN = Math.abs(Math.trunc(n));
  const res: number[] = [];
  if (absN === 0) return [0]; // divisor especial
  for (let i = 1; i <= absN; i++) {
    if (absN % i === 0) {
      res.push(i);
    }
  }
  return Array.from(new Set(res)).sort((a, b) => a - b);
}

function posiblesCerosRacionales(coeffs: number[]) {
  // a_n = coeficiente líder (first element), a_0 = término independiente (last element)
  const an = coeffs[0];
  const a0 = coeffs[coeffs.length - 1];
  const p = divisors(a0); // divisores de p (término independiente)
  const q = divisors(an); // divisores de q (coeficiente líder)

  // Formamos la lista sin simplificar: ± p/q para cada p en {1,3,...} y q en {1,3,...}
  const combos: string[] = [];
  for (const pi of p) {
    for (const qi of q) {
      // mostramos en forma no simplificada: \pm \frac{pi}{qi}
      combos.push(`\\frac{${pi}}{${qi}}`);
    }
  }

  // Eliminamos duplicados (por ejemplo si p contiene 1 y -1, usamos valores absolutos y luego anteponemos ±)
  const uniqueRaw = Array.from(new Set(combos.map((c) => c)));

  // Construimos la presentación: \pm 1/1, \pm 1/3, ... (mostrando solo las formas positivas en el numerador/denominador pero con ± delante)
  const positivePairs: string[] = [];
  for (const pi of p) {
    for (const qi of q) {
      positivePairs.push(`\\frac{${Math.abs(pi)}}{${Math.abs(qi)}}`);
    }
  }
  const positiveUnique = Array.from(new Set(positivePairs));

  // Construcción de texto LaTeX: \pm \frac{1}{1}, \pm \frac{1}{3}, ...
  const latexListRaw = positiveUnique.map((f) => `\\pm ${f}`).join(', ');

  // Lista simplificada: calculamos todas las fracciones y luego las simplificamos numéricamente (ej: 3/3 -> 1)
  const simplifiedSet = new Set<string>();
  for (const pi of p) {
    for (const qi of q) {
      if (qi === 0) continue;
      const val = pi / qi;
      // expresarlo como fracción simplificada posible o entero
      if (Number.isInteger(val)) {
        simplifiedSet.add(`\\pm ${val}`);
      } else {
        // simplificar fracción manual
        const g = gcd(Math.abs(pi), Math.abs(qi));
        const np = Math.abs(pi) / g;
        const nq = Math.abs(qi) / g;
        simplifiedSet.add(`\\pm \\tfrac{${np}}{${nq}}`);
      }
    }
  }

  const latexSimplified = Array.from(simplifiedSet).join(', ');

  return { latexListRaw, latexSimplified };
}

function gcd(a: number, b: number): number {
  if (!b) return a;
  return gcd(b, a % b);
}

function signOf(n: number) {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}

function buildColoredTerm(coef: number, exp: number) {
  const sign = coef >= 0 ? '+' : '-';
  const abs = Math.abs(coef);
  const coefStr = exp === 0 ? String(abs) : abs === 1 ? '' : String(abs);
  const varPart = exp === 0 ? '' : exp === 1 ? 'x' : `x^{${exp}}`;
  return `${sign}${coefStr}${varPart}`;
}

function coloredLatexForTerms(terms: Term[]) {
  // Devuelve una cadena LaTeX con términos coloreados y flechas en los cambios de signo
  // terms ya están en orden descendente de expo
  const parts: string[] = [];
  for (let i = 0; i < terms.length; i++) {
    const t = terms[i];
    const termLatex = buildColoredTerm(t.coef, t.exp);
    const colored = t.coef >= 0 ? `\\textcolor{green}{${termLatex}}` : `\\textcolor{red}{${termLatex}}`;
    parts.push(colored);

    // mirar siguiente término no nulo para decidir flecha
    const next = terms.slice(i + 1).find((x) => x.coef !== 0);
    if (next) {
      const signNow = signOf(t.coef);
      const signNext = signOf(next.coef);
      if (signNow !== 0 && signNext !== 0 && signNow !== signNext) {
        // cambio de signo -> mostrar flecha azul
        parts.push('\\; \\xrightarrow{\\textcolor{blue}{\\text{ cambio }}} \\;');
      } else {
        parts.push('\\; \\;');
      }
    }
  }
  return parts.join(' ');
}

function buildSubstitutionLatex(terms: Term[]) {
  // Ejemplo: 3(-x)^6 + 4(-x)^5 + 3(-x)^3 - (-x) - 3
  const parts: string[] = [];
  for (const t of terms) {
    const sign = t.coef >= 0 ? '+' : '-';
    const abs = Math.abs(t.coef);
    if (t.exp === 0) {
      parts.push(`${sign}${abs}`);
    } else if (t.exp === 1) {
      // caso -x
      parts.push(`${sign}${abs}(-x)`);
    } else {
      parts.push(`${sign}${abs}(-x)^{${t.exp}}`);
    }
  }
  // quitar posible + inicial y devolver limpio
  const s = parts.join(' \\; ');
  return s.replace(/^\+/, '');
}

function buildReducedNegLatex(terms: Term[]) {
  // Aplica (-x)^k => (-1)^k x^k y multiplica coef
  const reduced: Term[] = terms.map((t) => ({ exp: t.exp, coef: t.coef * (t.exp % 2 === 0 ? 1 : -1) }));
  return coloredLatexForTerms(reduced);
}

export default function ReglaDescartesExacto() {
  const [input, setInput] = useState("3x^6 + 4x^5 + 3x^3 - x - 3");
  type Resultado = {
    coeffs: number[];
    degree: number;
    terms: Term[];
    latexListRaw: string;
    latexSimplified: string;
    latexPx: string;
    latexPxColored: string;
    latexPminusRaw: string;
    latexPminusReduced: string;
    cambiosPos: number;
    cambiosNeg: number;
  };

  const [resultado, setResultado] = useState<Resultado | null>(null);

  function handleResolver() {
    try {
      const { coeffs, degree } = getCoeffsFromPolynomial(input);

      // construir lista de términos no nulos en orden decreciente de expo
      const terms: Term[] = [];
      for (let i = 0; i <= degree; i++) {
        const exp = degree - i;
        const coef = coeffs[i] || 0;
        if (coef !== 0) terms.push({ exp, coef });
      }

      // Posibles ceros racionales (p/q)
      const { latexListRaw, latexSimplified } = posiblesCerosRacionales(coeffs);

      // Cambios de signo para P(x)
      const cambiosPos = (() => {
        let cnt = 0;
        let lastSign = 0;
        for (const c of coeffs) {
          if (c === 0) continue;
          const s = signOf(c);
          if (lastSign === 0) {
            lastSign = s;
          } else {
            if (s !== lastSign) {
              cnt++;
              lastSign = s;
            } else {
              lastSign = s;
            }
          }
        }
        return cnt;
      })();

      // Cambios de signo para P(-x) (coef * (-1)^exp)
      const coeffsNeg = coeffs.map((c, idx) => {
        // idx corresponds to coefficient for exponent = degree - idx
        const exp = degree - idx;
        return c * (exp % 2 === 0 ? 1 : -1);
      });

      const cambiosNeg = (() => {
        let cnt = 0;
        let lastSign = 0;
        for (const c of coeffsNeg) {
          if (c === 0) continue;
          const s = signOf(c);
          if (lastSign === 0) {
            lastSign = s;
          } else {
            if (s !== lastSign) {
              cnt++;
              lastSign = s;
            } else {
              lastSign = s;
            }
          }
        }
        return cnt;
      })();

      // Generar LaTeX detallado
      const latexPx = `P(x) = ${terms
        .map((t, i) => {
          // formateamos con signo visible
          const sign = t.coef >= 0 ? `+${Math.abs(t.coef)}` : `-${Math.abs(t.coef)}`;
          const coefAbs = Math.abs(t.coef);
          const coefStr = t.exp === 0 ? `${coefAbs}` : coefAbs === 1 ? "" : `${coefAbs}`;
          const varPart = t.exp === 0 ? "" : t.exp === 1 ? `x` : `x^{${t.exp}}`;
          return `${sign}${coefStr}${varPart}`;
        })
        .join(' \\; ')};`;

      const latexPxColored = coloredLatexForTerms(terms);
      const latexPminusRaw = buildSubstitutionLatex(terms);
      const latexPminusReduced = buildReducedNegLatex(terms);

      setResultado({
        coeffs,
        degree,
        terms,
        latexListRaw,
        latexSimplified,
        latexPx,
        latexPxColored,
        latexPminusRaw,
        latexPminusReduced,
        cambiosPos,
        cambiosNeg,
      });
    } catch (e) {
      console.error(e);
      alert("Error al interpretar el polinomio. Usa formato como: 3x^6 + 4x^5 + 3x^3 - x - 3");
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-center text-blue-700">Ejemplo 1 — Dinámico (pasos exactos)</h1>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleResolver}>
          Resolver
        </button>
      </div>

      {resultado ? (
        <div className="space-y-6">
          <p>
            Polinomio: <InlineMath math={`P(x) = ${input}`} />
          </p>

          {/* Paso 1 */}
          <h2 className="text-lg font-semibold">1. Encontrando los ceros racionales posibles</h2>
          <p>
            Según el teorema del factor racional, los posibles ceros son \(p/q\) con \(p\) divisores del término
            independiente y \(q\) divisores del coeficiente líder.
          </p>
          <BlockMath math={`p = ${Math.abs(resultado.coeffs[resultado.coeffs.length - 1])} \;\\Rightarrow\; \\pm 1, \\pm ${Math.abs(resultado.coeffs[resultado.coeffs.length - 1])}`} />
          <BlockMath math={`q = ${Math.abs(resultado.coeffs[0])} \;\\Rightarrow\; \\pm 1, \\pm ${Math.abs(resultado.coeffs[0])}`} />

          <p>Lista no simplificada (todas las combinaciones p/q):</p>
          <BlockMath math={resultado.latexListRaw} />

          <p>Lista simplificada:</p>
          <BlockMath math={resultado.latexSimplified || "\text{(ninguna)"} />

          {/* Paso 2 */}
          <h2 className="text-lg font-semibold">2. Aplicar Regla de Descartes para ceros reales positivos</h2>
          <p>Escribimos los términos (en orden) y marcamos con color y flecha los cambios de signo:</p>
          <BlockMath math={resultado.latexPxColored} />

          <p className="bg-blue-50 p-3 rounded-xl">Se observa <strong>{resultado.cambiosPos}</strong> cambio(s) de signo → {resultado.cambiosPos} o {Math.max(0, resultado.cambiosPos - 2)} ceros reales positivos.</p>

          {/* Paso 3 */}
          <h2 className="text-lg font-semibold">3. Aplicar Regla de Descartes para ceros reales negativos</h2>
          <p>Primero sustituimos \(x \mapsto -x\) sin reducir:</p>
          <BlockMath math={resultado.latexPminusRaw} />

          <p>Reduciendo términos (aplicando \((-x)^k = (-1)^k x^k\)) y marcando cambios de signo:</p>
          <BlockMath math={resultado.latexPminusReduced} />

          <p className="bg-green-50 p-3 rounded-xl">Se observa <strong>{resultado.cambiosNeg}</strong> cambio(s) de signo → {resultado.cambiosNeg} o {Math.max(0, resultado.cambiosNeg - 2)} ceros reales negativos.</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Ingrese un polinomio y presione Resolver para ver los pasos.</p>
      )}
    </div>
  );
}
