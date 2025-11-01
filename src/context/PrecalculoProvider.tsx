"use client";
import "katex/dist/katex.min.css";
import { createContext, useState, JSX, useMemo, useCallback } from "react";
import {
  Complex,
  Op,
  PrecalculoContextType,
  ProviderProps,
  Quadrant,
  Resultado,
  Step,
  SynStep,
  Term,
} from "../types";
import Fraction from "fraction.js";
import { QuadraticSolver } from "@/components/QuadraticSolver";
import { BiquadraticSolver } from "@/components/BiquadraticSolver";

const PrecalculoContext = createContext<PrecalculoContextType>(null!);

const PrecalculoProvider = ({ children }: ProviderProps) => {
  //TODO: Ecuaciones
  const [equation, setEquation] = useState("1x^4-8x^2+2=0");
  const [steps, setSteps] = useState<JSX.Element[]>([]);
  const parseCoeff = (raw: string | undefined, defOne = 1) => {
    if (raw === undefined) return NaN;
    if (raw === "" || raw === "+") return defOne;
    if (raw === "-") return -defOne;
    return Number(raw);
  };
  const gcd3 = (a: number, b: number) => {
    a = Math.trunc(Math.abs(a));
    b = Math.trunc(Math.abs(b));
    while (b) [a, b] = [b, a % b];
    return a || 1;
  };
  const fracSimplifyLatex = (num: number, den: number) => {
    if (den === 0) return "\\text{indeterminado}";
    const sign = num < 0 !== den < 0 ? "-" : "";
    const n = Math.trunc(Math.abs(num));
    const d = Math.trunc(Math.abs(den));
    const g = gcd3(n, d);
    const nn = n / g;
    const dd = d / g;
    if (dd === 1) return `${sign}${nn}`;
    return `${sign}\\frac{${nn}}{${dd}}`;
  };
  const isPerfectSquare = (n: number) =>
    n >= 0 && Number.isInteger(Math.sqrt(n));
  /** descompone n = s^2 * r, con r libre de cuadrados; retorna [s, r] */
  const factorSquare = (n: number): [number, number] => {
    if (n <= 0) return [0, 0];
    let outside = 1;
    let inside = n;
    for (let k = 2; k * k <= inside; k++) {
      while (inside % (k * k) === 0) {
        outside *= k;
        inside /= k * k;
      }
    }
    return [outside, inside];
  };
  /** √n en LaTeX con extracción de cuadrados perfectos */
  const sqrtDecompLatex = (n: number): string => {
    if (n < 0) return `i\\,${sqrtDecompLatex(-n)}`; // no se usa aquí directamente
    if (n === 0) return "0";
    if (isPerfectSquare(n)) return String(Math.sqrt(n));
    const [s, r] = factorSquare(n);
    return r === 1 ? String(s) : `${s}\\sqrt{${r}}`;
  };
  const round2 = (v: number) => Number(v.toFixed(2));

  const solve = () => {
    try {
      const cleaned = equation.replace(/\s+/g, "").replace(/=0$/, "");

      /** ---------- Caso 1: BICUADRADA  ax^4 + bx^2 + c = 0 ---------- */
      const biquad = cleaned.match(/^([+-]?\d*)x\^4([+-]?\d*)x\^2([+-]?\d+)$/i);
      if (biquad) {
        const a = parseCoeff(biquad[1], 1);
        const b = parseCoeff(biquad[2], 1);
        const c = parseCoeff(biquad[3], 0);

        if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) {
          setSteps([
            <p key="err1" className="text-red-500">
              Coeficientes inválidos.
            </p>,
          ]);
          return;
        }

        const steps = BiquadraticSolver({
          equation,
          a,
          b,
          c,
          factorSquare,
          sqrtDecompLatex,
          fracSimplifyLatex,
          isPerfectSquare,
          round2,
        });

        setSteps(steps);
        return;
      }

      /** ---------- Caso 2: CUADRÁTICA  ax^2 + bx + c = 0 ---------- */
      const quad = cleaned.match(/^([+-]?\d*)x\^2([+-]?\d*)x([+-]?\d+)$/i);
      if (quad) {
        const a = parseCoeff(quad[1], 1);
        const b = parseCoeff(quad[2], 1);
        const c = parseCoeff(quad[3], 0);

        if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) {
          setSteps([
            <p key="err2" className="text-red-500">
              Coeficientes inválidos.
            </p>,
          ]);
          return;
        }

        const steps = QuadraticSolver({
          equation,
          a,
          b,
          c,
          factorSquare,
          sqrtDecompLatex,
          fracSimplifyLatex,
          isPerfectSquare,
        });

        setSteps(steps);
        return;
      }

      /** ---------- Caso no reconocido ---------- */
      setSteps([
        <p key="no" className="text-red-500">
          Formato no reconocido. Ejemplos: <code>x^4-8x^2+2=0</code>,{" "}
          <code>2x^2+3x-1=0</code>, <code>x^2+4x+5=0</code>
        </p>,
      ]);
    } catch {
      setSteps([
        <p key="err" className="text-red-500">
          Error al procesar la ecuación.
        </p>,
      ]);
    }
  };

  //TODO: Geometria Analitica
  const [puntoP, setPuntoP] = useState({ x: -2, y: 2 });
  const [puntoQ, setPuntoQ] = useState({ x: 2, y: -4 });
  const { x: x1, y: y1 } = puntoP;
  const { x: x2, y: y2 } = puntoQ;
  // Distancia
  const distancia = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  // Punto medio
  const puntoMedio = {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
  // Pendiente
  const pendiente = x2 - x1 !== 0 ? (y2 - y1) / (x2 - x1) : Infinity;
  // Ecuación de la recta: y - y1 = m(x - x1)
  let ecuacionPasos: string[] = [];
  if (pendiente !== Infinity) {
    ecuacionPasos = [
      `y - ${y1} = m(x - (${x1}))`,
      `y - ${y1} = ${pendiente.toFixed(2)}(x - (${x1}))`,
      `y - ${y1} = ${pendiente.toFixed(2)}x + (${(-pendiente * x1).toFixed(
        2
      )})`,
      `y = ${pendiente.toFixed(2)}x + ${(y1 - pendiente * x1).toFixed(2)}`,
    ];
  }

  //TODO: Polinomios

  const [a, setA] = useState(-1);
  const [b, setB] = useState(1);
  const [c, setC] = useState(2);
  const [useFractions, setUseFractions] = useState(false);

  // Vértice
  const h = -b / (2 * a);
  const k = a * h * h + b * h + c;

  // Fracciones si el toggle está activado
  const formatNumber = (num: number) => {
    if (useFractions) {
      return new Fraction(num).toFraction(true); // forma simplificada
    }
    return num.toFixed(2);
  };
  const formatTerm = (coef: number, variable: string = "") => {
    if (coef === 0) return "";
    if (coef > 0) return `+ ${coef}${variable}`;
    return `- ${Math.abs(coef)}${variable}`;
  };

  // Forma normal paso a paso
  // f(x) = ax^2 + bx + c
  // completando el cuadrado
  const paso1 = `f(x) = ${a}x^2 ${formatTerm(b, "x")} ${formatTerm(c)}`;

  // Paso 2: factor común de "a"
  const paso2 = `f(x) = ${a}\\left(x^2 ${formatTerm(
    b / a,
    "x"
  )}\\right) ${formatTerm(c)}`;

  // Paso 3: completar cuadrado
  const paso3 = `f(x) = ${a}\\left(x^2 ${formatTerm(
    b / a,
    "x"
  )} + \\left(\\frac{${b}}{2${a}}\\right)^2 - \\left(\\frac{${b}}{2${a}}\\right)^2\\right) ${formatTerm(
    c
  )}`;

  // Paso 4: agrupando en binomio cuadrado
  const paso4 = `f(x) = ${a}\\left((x + \\frac{${b}}{2${a}})^2 - \\left(\\frac{${b}}{2${a}}\\right)^2\\right) ${formatTerm(
    c
  )}`;

  // Paso 5: forma normal (con vértice)
  const paso5 = `f(x) = ${a}(x - (${formatNumber(h)}))^2 ${formatTerm(
    Number(formatNumber(k))
  )}`;

  // Máximo o mínimo
  const extremo = a > 0 ? "mínimo" : "máximo";

  // Generar datos para graficar
  const data = Array.from({ length: 41 }, (_, i) => {
    const x = h - 5 + i * 0.25;
    return { x, y: a * x * x + b * x + c };
  });

  //TODO: Graficas Polinomios

  // --------- Definición del polinomio dinámico ----------
  // Definimos la clase Polynomial para manejar polinomios dinámicamente
  class Polynomial {
    coefficients: number[];

    constructor(coefficients: number[]) {
      // Los coeficientes se pasan en orden descendente: [a, b, c] para ax² + bx + c
      this.coefficients = [...coefficients];
      // Eliminar ceros iniciales excepto si el polinomio es 0
      while (this.coefficients.length > 1 && this.coefficients[0] === 0) {
        this.coefficients.shift();
      }
    }

    // Evaluación del polinomio en un punto x
    evaluate(x: number): number {
      return this.coefficients.reduce((sum, coef, i) => {
        return sum + coef * Math.pow(x, this.degree() - i);
      }, 0);
    }

    // Grado del polinomio
    degree(): number {
      return this.coefficients.length - 1;
    }

    // Derivada del polinomio
    derivative(): Polynomial {
      if (this.degree() === 0) return new Polynomial([0]);

      const derivCoefficients = this.coefficients
        .slice(0, -1)
        .map((coef, i) => {
          return coef * (this.degree() - i);
        });

      return new Polynomial(derivCoefficients);
    }

    // Representación en LaTeX
    toLaTeX(): string {
      if (this.coefficients.every((c) => c === 0)) return "0";

      return this.coefficients
        .map((coef, i) => {
          const power = this.degree() - i;
          if (coef === 0) return "";

          let term = "";
          // Signo
          if (i === 0) {
            term = coef < 0 ? "-" : "";
          } else {
            term = coef < 0 ? " - " : " + ";
          }

          // Coeficiente (valor absoluto)
          const absCoef = Math.abs(coef);
          if (absCoef !== 1 || power === 0) {
            term += absCoef;
          }

          // Variable y exponente
          if (power > 0) {
            term += "x";
            if (power > 1) {
              term += `^${power}`;
            }
          }

          return term;
        })
        .filter(Boolean)
        .join("");
    }

    // Encuentra los factores del polinomio
    factorize(): {
      factored: string;
      expandedForm: string;
      factorsForm: string;
      equationForm: string;
      rootsForm: string;
      hasMultipleRoots: boolean;
      multipleRootValue?: number;
    } {
      // Implementación específica para los polinomios que necesitamos manejar
      // Esta es una implementación simple para los casos comunes

      // Para x^3-2x^2-3x = x(x^2-2x-3) = x(x-3)(x+1)
      if (
        this.degree() === 3 &&
        this.coefficients[0] === 1 &&
        this.coefficients[1] === -2 &&
        this.coefficients[2] === -3 &&
        this.coefficients[3] === 0
      ) {
        return {
          factored: "x(x-3)(x+1)",
          expandedForm: " x(x^2-2x-3)",
          factorsForm: "x(x-3)(x+1) = 0",
          equationForm:
            "x = 0 \\quad \\lor \\quad x-3=0 \\quad \\lor \\quad x+1=0",
          rootsForm: "x = 0, \\quad x = 3, \\quad x = -1",
          hasMultipleRoots: false,
        };
      }

      // Para el polinomio predeterminado: -2x^4 - x^3 + 3x^2 = -x^2(2x^2 + x - 3) = -x^2(2x + 3)(x - 1)
      if (
        this.degree() === 4 &&
        this.coefficients[0] === -2 &&
        this.coefficients[1] === -1 &&
        this.coefficients[2] === 3 &&
        this.coefficients[3] === 0 &&
        this.coefficients[4] === 0
      ) {
        return {
          factored: "-x^2(2x + 3)(x - 1)",
          expandedForm: "-x^2(2x^2 + x - 3)",
          factorsForm: "-x^2(2x + 3)(x - 1) = 0",
          equationForm:
            "-x^2 = 0 \\quad \\lor \\quad 2x+3=0 \\quad \\lor \\quad x-1=0",
          rootsForm: "x = 0, \\quad x = -\\tfrac{3}{2}, \\quad x = 1",
          hasMultipleRoots: true,
          multipleRootValue: 0,
        };
      }

      // Para otros polinomios - implementación por defecto
      return {
        factored: this.toLaTeX(),
        expandedForm: this.toLaTeX(),
        factorsForm: `${this.toLaTeX()} = 0`,
        equationForm: `${this.toLaTeX()} = 0`,
        rootsForm: "No se pudo factorizar de forma explícita",
        hasMultipleRoots: false,
      };
    }
  }

  // Función para analizar la expresión de polinomio
  function parsePolynomial(expr: string): number[] {
    // Expresión por defecto si está vacía
    if (!expr.trim()) {
      return [-2, -1, 3, 0, 0]; // -2x^4 - x^3 + 3x^2
    }

    // Normalizar la expresión: convertir - a +-, quitar espacios, etc.
    let normalized = expr
      .replace(/\s/g, "")
      .replace(/-/g, "+-")
      .replace(/\+\+/g, "+")
      .replace(/\^(\d+)/g, "^$1"); // Asegurarse de que los exponentes son legibles

    if (normalized.startsWith("+")) {
      normalized = normalized.substring(1);
    }

    // Dividir en términos
    const terms = normalized.split("+");
    const coefficients: { [key: number]: number } = {};
    let maxDegree = 0;

    for (const term of terms) {
      if (!term) continue;

      // Procesar término negativo
      const isNegative = term.startsWith("-");
      const cleanTerm = isNegative ? term.substring(1) : term;

      // Extraer coeficiente y variable con exponente
      let coef = 1;
      let degree = 0;

      if (cleanTerm.includes("x")) {
        // Término con x
        const parts = cleanTerm.split("x");
        if (parts[0] !== "") {
          coef = parseFloat(parts[0]);
        }

        if (parts[1] && parts[1].startsWith("^")) {
          // x con exponente
          degree = parseInt(parts[1].substring(1));
        } else {
          // Solo x (exponente 1)
          degree = 1;
        }
      } else {
        // Término constante
        coef = parseFloat(cleanTerm);
        degree = 0;
      }

      // Aplicar signo negativo si es necesario
      if (isNegative) {
        coef = -coef;
      }

      // Actualizar coeficiente y maxDegree
      coefficients[degree] = (coefficients[degree] || 0) + coef;
      maxDegree = Math.max(maxDegree, degree);
    }

    // Crear array de coeficientes en orden descendente
    const result: number[] = [];
    for (let i = maxDegree; i >= 0; i--) {
      result.push(coefficients[i] || 0);
    }

    return result;
  }

  const [polynomialExpr, setPolynomialExpr] = useState("x^3-2x^2-3x");
  const [polynomial, setPolynomial] = useState(
    () => new Polynomial([1, -2, -3, 0])
  );

  const handlePolynomialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newExpr = e.target.value;
    setPolynomialExpr(newExpr);

    // Actualizar el polinomio en base a la nueva expresión
    const coeffs = parsePolynomial(newExpr);
    setPolynomial(new Polynomial(coeffs));
  };

  // Funciones para evaluación (usadas en el cálculo de puntos críticos y para graficar)
  const g = useCallback((x: number) => polynomial.evaluate(x), [polynomial]);

  // Derivadas
  const gPrime = polynomial.derivative();
  const gDoublePrime = gPrime.derivative();

  // Expresiones LaTeX
  const gLatex = polynomial.toLaTeX();

  // Factorización y pasos
  const factorization = polynomial.factorize();

  // Raíces y puntos críticos
  // Para este ejemplo, los calcularemos de forma simplificada
  const roots =
    polynomial === new Polynomial([-2, -1, 3, 0, 0])
      ? [
          { x: 0, y: 0, note: "raíz (doble)" },
          { x: -1.5, y: 0, note: "raíz" },
          { x: 1, y: 0, note: "raíz" },
        ]
      : polynomial === new Polynomial([1, -2, -3, 0])
      ? [
          { x: 0, y: 0, note: "raíz" },
          { x: 3, y: 0, note: "raíz" },
          { x: -1, y: 0, note: "raíz" },
        ]
      : [];

  // Puntos críticos simplificados
  let criticalPoints: {
    x: number;
    y: number;
    type: "max" | "min";
    label: string;
  }[] = [];

  if (polynomial === new Polynomial([-2, -1, 3, 0, 0])) {
    const sqrt201 = Math.sqrt(201);
    const criticalXs = [0, (-3 + sqrt201) / 16, (-3 - sqrt201) / 16];

    criticalPoints = criticalXs.map((x) => {
      const y = g(x);
      const second = gDoublePrime.evaluate(x);
      const type: "max" | "min" = second < 0 ? "max" : "min";
      const label = `${type} (${x.toFixed(6)}, ${y.toFixed(6)})`;
      return { x, y, type, label };
    });
  } else if (polynomial === new Polynomial([1, -2, -3, 0])) {
    // Para x^3-2x^2-3x, calculamos los puntos críticos
    // f'(x) = 3x^2-4x-3 = 0
    // Discriminante = 16+36 = 52
    // x = (4 ± √52)/6
    const sqrt52 = Math.sqrt(52);
    const criticalXs = [(4 + sqrt52) / 6, (4 - sqrt52) / 6];

    criticalPoints = criticalXs.map((x) => {
      const y = g(x);
      const second = gDoublePrime.evaluate(x);
      const type: "max" | "min" = second < 0 ? "max" : "min";
      const label = `${type} (${x.toFixed(6)}, ${y.toFixed(6)})`;
      return { x, y, type, label };
    });
  }

  const xMin = -3,
    xMax = 3,
    step = 0.01;
  // Datos para la curva
  const data2 = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = xMin; x <= xMax + 1e-9; x += step) {
      const xx = parseFloat(x.toFixed(4));
      pts.push({ x: xx, y: g(xx) });
    }
    return pts;
  }, [g, xMin, xMax]);

  //TODO: Limites superiores e inferiores
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

  function candidatesByRRT(
    constant: number,
    leading: number
  ): { p: number[]; q: number[]; list: number[] } {
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
        (absc === 1 && e !== 0 ? "" : `${absc}`) +
        (e === 0 ? "" : e === 1 ? "x" : `x^{${e}}`);
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
  function factorQuadraticInt(
    a: number,
    b: number,
    c: number
  ): null | [number, number] {
    if (a === 0) return null;
    // Sólo manejamos monicos o a con factores enteros simples
    if (a !== 1) {
      // reescala si a divide a b y c
      const g = gcd(gcd(a, b), c);
      if (g !== 1) {
        a /= g;
        b /= g;
        c /= g;
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

  const [input, setInput] = useState("2x^5+5x^4-8x^3-14x^2+6x+9");
  const [run, setRun] = useState(0);

  // Parseo: convierte string a coeficientes (grado descendente)
  const parsePolynomial2 = (s: string): number[] => {
    const cleaned = s.replace(/\s+/g, "");
    const termRe = /([+-]?\d*)x\^?(\d+)?|([+-]?\d+)/g;
    const terms: { c: number; e: number }[] = [];
    for (const m of cleaned.matchAll(termRe)) {
      if (m[1] !== undefined && m[1] !== "") {
        const coef =
          m[1] === "+" || m[1] === ""
            ? 1
            : m[1] === "-"
            ? -1
            : parseInt(m[1], 10);
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

  const data3 = useMemo(() => {
    const coeffs0 = parsePolynomial2(input);
    const leading = coeffs0[0];
    const constant = coeffs0[coeffs0.length - 1];

    const { p, q, list } = candidatesByRRT(constant, leading);

    // Factorización por raíces racionales (mostramos sólo los intentos que funcionan, como en las imágenes)
    const synSteps: SynStep[] = [];
    let coeffs = coeffs0.slice();
    const foundRoots: number[] = [];
    const integralizedPairs: Array<{
      combined: boolean;
      r: number;
      gUsed: number;
    }> = [];

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
        const [qden] = reduceFraction(Math.round(Math.abs(chosen) * 1e9), 1e9);
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
      const { list: list2 } = candidatesByRRT(
        coeffs[coeffs.length - 1],
        coeffs[0]
      );
      const ordered2 = [
        ...list2.filter((x) => x > 0),
        ...list2.filter((x) => x < 0),
      ];
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
      partials.push(`P(x) = ${prefix}${factorLatex}\\left(${Qlatex}\\right)`);

      // 2) Si se puede, mostramos sacar MCD del cociente y combinar g*(x-p/q)
      if (!Number.isInteger(r)) {
        const [pp, qq] = reduceFraction(Math.round(Math.abs(r) * 1e9), 1e9);
        const gQ = gcdArray(quotient);
        if (gQ > 1) {
          // Mostrar: P(x) = (...) (x - p/q) g (Q/g)
          const Qdiv = quotient.map((c) => c / gQ);
          partials.push(
            `P(x) = ${prefix}${factorLatex}\\,${gQ}\\left(${polyToLatex(
              Qdiv
            )}\\right)`
          );
          // ¿Se puede combinar como en la imagen?
          if (gQ % qq === 0) {
            const k = gQ / qq; // si k==1, coincide exactamente con el ejemplo
            const sign = r >= 0 ? "-" : "+";
            const combined =
              k === 1
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
    let quadBox: {
      eqLine: string;
      factLine?: string;
      factorsLatex?: string;
    } | null = null;

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
      p,
      q,
      list,
      synSteps,
      upperBoundNoteIndex,
      partials,
      quadBox,
      finalLatex,
    };
  }, [input]);

  //TODO: Division de Polinomios
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
        if (rawCoef === "" || rawCoef === "+" || rawCoef === undefined)
          coef = 1;
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

    const steps2: Step[] = [];
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

      steps2.push({ subtrahend: sub, remainder: newR });
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
      steps2,
    };
  }

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

  //TODO: DESCARTE DE SIGNOS

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
      term = term.replace(/\*/g, "").replace(/X/g, "x"); // normaliza ANTES
      if (term.includes("x")) {
        const idx = term.indexOf("x");
        let coefStr = term.substring(0, idx);
        if (coefStr === "" || coefStr === "+") coefStr = "1";
        if (coefStr === "-") coefStr = "1";

        // si no hay número explícito, es 1
        if (coefStr === "" || coefStr === "+") coefStr = "1";
        if (coefStr === "-") coefStr = "1"; // el signo lo manejamos aparte

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

    // Ahora construimos arreglo denso desde degree hasta 0
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
    //const uniqueRaw = Array.from(new Set(combos.map((c) => c)));

    // Construimos la presentación: \pm 1/1, \pm 1/3, ... (mostrando solo las formas positivas en el numerador/denominador pero con ± delante)
    const positivePairs: string[] = [];
    for (const pi of p) {
      for (const qi of q) {
        positivePairs.push(`\\frac{${Math.abs(pi)}}{${Math.abs(qi)}}`);
      }
    }
    const positiveUnique = Array.from(new Set(positivePairs));

    // Construcción de texto LaTeX: \pm \frac{1}{1}, \pm \frac{1}{3}, ...
    const latexListRaw = positiveUnique.map((f) => `\\pm ${f}`).join(", ");

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
          const g = gcd2(Math.abs(pi), Math.abs(qi));
          const np = Math.abs(pi) / g;
          const nq = Math.abs(qi) / g;
          simplifiedSet.add(`\\pm \\tfrac{${np}}{${nq}}`);
        }
      }
    }

    const latexSimplified = Array.from(simplifiedSet).join(", ");

    return { latexListRaw, latexSimplified };
  }

  function gcd2(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) [a, b] = [b, a % b];
    return a;
  }

  function signOf(n: number) {
    if (n > 0) return 1;
    if (n < 0) return -1;
    return 0;
  }

  function buildColoredTerm(coef: number, exp: number) {
    const sign = coef >= 0 ? "+" : "-";
    const abs = Math.abs(coef);
    const coefStr = exp === 0 ? String(abs) : abs === 1 ? "" : String(abs);
    const varPart = exp === 0 ? "" : exp === 1 ? "x" : `x^{${exp}}`;
    return `${sign}${coefStr}${varPart}`;
  }

  function coloredLatexForTerms(terms: Term[]) {
    // Devuelve una cadena LaTeX con términos coloreados y flechas en los cambios de signo
    // terms ya están en orden descendente de expo
    const parts: string[] = [];
    for (let i = 0; i < terms.length; i++) {
      const t = terms[i];
      const termLatex = buildColoredTerm(t.coef, t.exp);
      const colored =
        t.coef >= 0
          ? `\\textcolor{green}{${termLatex}}`
          : `\\textcolor{red}{${termLatex}}`;
      parts.push(colored);

      // mirar siguiente término no nulo para decidir flecha
      const next = terms.slice(i + 1).find((x) => x.coef !== 0);
      if (next) {
        const signNow = signOf(t.coef);
        const signNext = signOf(next.coef);
        if (signNow !== 0 && signNext !== 0 && signNow !== signNext) {
          // cambio de signo -> mostrar flecha azul
          parts.push("\\; \\xrightarrow{\\textcolor{blue}{\\text{ }}} \\;");
        } else {
          parts.push("\\; \\;");
        }
      }
    }
    return parts.join(" ");
  }

  function buildSubstitutionLatex(terms: Term[]) {
    // Ejemplo: 3(-x)^6 + 4(-x)^5 + 3(-x)^3 - (-x) - 3
    const parts: string[] = [];
    for (const t of terms) {
      const sign = t.coef >= 0 ? "+" : "-";
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
    const s = parts.join(" \\; ");
    return s.replace(/^\+/, "");
  }

  function buildReducedNegLatex(terms: Term[]) {
    // Aplica (-x)^k => (-1)^k x^k y multiplica coef
    const reduced: Term[] = terms.map((t) => ({
      exp: t.exp,
      coef: t.coef * (t.exp % 2 === 0 ? 1 : -1),
    }));
    return coloredLatexForTerms(reduced);
  }

  const [input2, setInput2] = useState("x^5 - 3x^4 + 12x^3 - 28x^2 + 27x - 9");

  const [resultado, setResultado] = useState<Resultado | null>(null);

  function handleResolver() {
    try {
      const { coeffs, degree } = getCoeffsFromPolynomial(input2);
      console.log("Coeficientes:", coeffs, "grado:", degree);

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
      const latexPx =
        "P(x) =" +
        terms
          .map((t) => {
            // formateamos con signo visible
            const sign =
              t.coef >= 0 ? `+${Math.abs(t.coef)}` : `-${Math.abs(t.coef)}`;
            const coefAbs = Math.abs(t.coef);
            const coefStr =
              t.exp === 0 ? `${coefAbs}` : coefAbs === 1 ? "" : `${coefAbs}`;
            const varPart =
              t.exp === 0 ? "" : t.exp === 1 ? `x` : `x^{${t.exp}}`;
            return `${sign}${coefStr}${varPart}`;
          })
          .join(" \\; ");

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
      alert(
        "Error al interpretar el polinomio. Usa formato como: 3x^6 + 4x^5 + 3x^3 - x - 3"
      );
    }
  }

  //----NUMEROS COMPLEJOS----//

  // ------- utilidades -------
  const sgn = (n: number) => (n >= 0 ? "+" : "-");
  const abs2 = (n: number) => Math.abs(n);
  const isInt = (x: number) => Number.isInteger(x);

  const complexLatex = (z: Complex, parens = true) => {
    const s = `${z.re} ${sgn(z.im)} ${abs(z.im)}i`;
    return parens ? `\\left(${s}\\right)` : s;
  };

  const gcd4 = (a: number, b: number): number => {
    a = Math.trunc(Math.abs(a));
    b = Math.trunc(Math.abs(b));
    while (b) [a, b] = [b, a % b];
    return a || 1;
  };
  const gcd5 = (a: number, b: number, c: number) => gcd2(gcd2(a, b), c);

  // entero, fracción simplificada, o decimal si hace falta
  const fracLatex = (num: number, den: number) => {
    if (den === 0) return "\\text{indefinido}";
    if (isInt(num) && isInt(den)) {
      const g = gcd2(num, den);
      const n = num / g,
        d = den / g;
      return d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`;
    }
    return `${(num / den).toFixed(3)}`;
  };

  // ------- operaciones -------
  const add = (a: Complex, b: Complex): Complex => ({
    re: a.re + b.re,
    im: a.im + b.im,
  });
  const sub = (a: Complex, b: Complex): Complex => ({
    re: a.re - b.re,
    im: a.im - b.im,
  });
  const mul = (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  });
  const div = (a: Complex, b: Complex): Complex => {
    const den = b.re * b.re + b.im * b.im;
    return {
      re: (a.re * b.re + a.im * b.im) / den,
      im: (a.im * b.re - a.re * b.im) / den,
    };
  };

  // ------- pasos LaTeX -------
  function stepsAdd(a: Complex, b: Complex) {
    const r = add(a, b);
    return [
      `${complexLatex(a)} + ${complexLatex(b)}`,
      `= \\left(${a.re} + ${b.re}\\right) + \\left(${a.im} + ${b.im}\\right)i`,
      `= ${r.re} ${sgn(r.im)} ${abs(r.im)}i`,
    ];
  }
  function stepsSub(a: Complex, b: Complex) {
    const r = sub(a, b);
    return [
      `${complexLatex(a)} - ${complexLatex(b)}`,
      `= \\left(${a.re} - ${b.re}\\right) + \\left(${a.im} - ${b.im}\\right)i`,
      `= ${r.re} ${sgn(r.im)} ${abs(r.im)}i`,
    ];
  }
  function stepsMul(a: Complex, b: Complex) {
    const r = mul(a, b);
    const ac = a.re * b.re,
      ad = a.re * b.im,
      bc = a.im * b.re,
      bd = a.im * b.im;
    return [
      `${complexLatex(a)}\\,${complexLatex(b)}`,
      `= (${a.re}+${a.im}i)(${b.re}+${b.im}i)`,
      `= ${ac} + ${ad}i + ${bc}i + ${bd}i^{2}`,
      `= ${ac - bd} ${sgn(ad + bc)} ${abs(
        ad + bc
      )}i\\quad\\text{(porque }i^{2}=-1\\text{)}`,
      `= ${r.re} ${sgn(r.im)} ${abs(r.im)}i`,
    ];
  }
  function stepsDiv(a: Complex, b: Complex, showFraction: boolean) {
    const den = b.re * b.re + b.im * b.im;
    const ac = a.re * b.re,
      bd = a.im * b.im,
      bc = a.im * b.re,
      ad = a.re * b.im;

    const reNum = ac + bd; // numerador parte real
    const imNum = bc - ad; // numerador parte imaginaria
    const gAll = gcd5(reNum, imNum, den);

    const reS = reNum / gAll,
      imS = imNum / gAll,
      denS = den / gAll;

    if (showFraction) {
      return [
        `\\dfrac{${complexLatex(a, false)}}{${complexLatex(b, false)}}`,
        `= \\dfrac{${complexLatex(a, false)}\\,(${b.re}-${
          b.im
        }i)}{${complexLatex(b, false)}\\,(${b.re}-${
          b.im
        }i)}\\quad\\text{(conjugado)}`,
        `= \\dfrac{(${a.re}+${a.im}i)(${b.re}-${b.im}i)}{(${b.re})^{2}+(${b.im})^{2}}`,
        `= \\dfrac{${reNum} ${sgn(imNum)} ${abs(imNum)}i}{${den}}`,
        gAll > 1
          ? `= \\dfrac{${reS} ${sgn(imS)} ${abs(
              imS
            )}i}{${denS}}\\quad\\text{(simplificando por }${gAll}\\text{)}`
          : "",
        `= ${fracLatex(reNum, den)} ${sgn(imNum)} ${fracLatex(
          abs(imNum),
          den
        )}i`,
      ].filter(Boolean);
    } else {
      return [
        `\\dfrac{${complexLatex(a, false)}}{${complexLatex(b, false)}}`,
        `= ${(reNum / den).toFixed(3)} ${sgn(imNum)} ${(
          Math.abs(imNum) / den
        ).toFixed(3)}i`,
      ];
    }
  }

  // ------- potencias de i -------
  function powerISteps(n: number) {
    if (!Number.isInteger(n)) return ["\\text{Usa un exponente entero.}"];
    if (n === 0) return ["i^{0} = 1"];
    const sign = n < 0 ? "-" : "";
    const m = Math.abs(n);
    const q = Math.floor(m / 4);
    const r = m % 4;

    const base = ["1", "i", "-1", "-i"][r]; // r = 0,1,2,3
    const final =
      n < 0 ? (r === 0 ? "1" : r === 1 ? "-i" : r === 2 ? "-1" : "i") : base;

    const lines: string[] = [];
    lines.push(`i^{${n}} = i^{${sign}${m}}`);
    if (n < 0) lines.push(`= \\dfrac{1}{i^{${m}}}`);
    lines.push(`= i^{4\\cdot ${q} + ${r}}`);
    lines.push(`= (i^{4})^{${q}}\\, i^{${r}}`);
    lines.push(`= ${final}`);
    return lines;
  }

  const [a2, setA2] = useState<Complex>({ re: 3, im: 5 });
  const [b2, setB2] = useState<Complex>({ re: 4, im: 2 });
  const [op, setOp] = useState<Op>("add");
  const [exp, setExp] = useState<number>(23);
  const [showFraction, setShowFraction] = useState(true);

  const steps2 = useMemo(() => {
    if (op === "add") return stepsAdd(a2, b2);
    if (op === "sub") return stepsSub(a2, b2);
    if (op === "mul") return stepsMul(a2, b2);
    if (b2.re === 0 && b2.im === 0) return ["\\text{División por cero}"];
    return stepsDiv(a2, b2, showFraction);
  }, [a2, b2, op, showFraction]);

  const prettyResult = useMemo(() => {
    if (op !== "div") {
      const z =
        op === "add" ? add(a2, b2) : op === "sub" ? sub(a2, b2) : mul(a2, b2);
      return `${z.re} ${sgn(z.im)} ${abs(z.im)}i`;
    }
    const den = b2.re * b2.re + b2.im * b2.im;
    const reNum = a2.re * b2.re + a2.im * b2.im;
    const imNum = a2.im * b2.re - a2.re * b2.im;
    const gAll = gcd5(reNum, imNum, den);
    const reS = reNum / gAll,
      imS = imNum / gAll,
      denS = den / gAll;
    return showFraction
      ? `\\dfrac{${reS} ${sgn(imS)} ${abs(imS)}i}{${denS}}`
      : `${(reNum / den).toFixed(3)} ${sgn(imNum)} ${(
          Math.abs(imNum) / den
        ).toFixed(3)}i`;
  }, [a2, b2, op, showFraction]);

  const powSteps = useMemo(() => powerISteps(exp), [exp]);

  /*   ---- IDENTIDADES FUNDAMENTALES ----   */

  // Función para simplificar fracciones
  function simplifyFraction(num: number, den: number): [number, number] {
    function gcd(a: number, b: number): number {
      return b === 0 ? a : gcd(b, a % b);
    }
    const divisor = gcd(Math.abs(num), Math.abs(den));
    return [num / divisor, den / divisor];
  }

  // Generar string tipo "\tfrac{a}{b}"
  function fracLatex2(num: number, den: number): string {
    if (den === 1) return `${num}`;
    return `\\tfrac{${num}}{${den}}`;
  }

  const [sinNum, setSinNum] = useState(3);
  const [sinDen, setSinDen] = useState(5);
  const [quadrant, setQuadrant] = useState<Quadrant>(2);

  // ================== Calculos ==================

  // Seno
  const sinFrac = simplifyFraction(sinNum, sinDen);

  // Coseno
  const cosNumSq = sinDen ** 2 - sinNum ** 2;
  const cosDenSq = sinDen ** 2;
  const cosNum = Math.sqrt(cosNumSq);
  const cosDen = Math.sqrt(cosDenSq);

  // Simplificar coseno
  const [cosSimpleNumBase, cosSimpleDen] = simplifyFraction(cosNum, cosDen);

  // Aplicar signo de acuerdo al cuadrante
  const cosSimpleNum =
    quadrant === 2 || quadrant === 3 ? -cosSimpleNumBase : cosSimpleNumBase;

  // Cosecante
  const [cscNum, cscDen] = simplifyFraction(sinDen, sinNum);

  // Secante
  const [secNum, secDen] = simplifyFraction(cosSimpleDen, cosSimpleNum);

  // Tangente
  const [tanNum, tanDen] = simplifyFraction(
    sinFrac[0] * cosSimpleDen,
    sinFrac[1] * cosSimpleNum
  );
  // Cotangente
  const [cotNum, cotDen] = simplifyFraction(tanDen, tanNum);

  /*   ---- Curvas SENO Y COSENO ----   */

  // Generar datos de la gráfica
  const generateData = (a: number, k: number) => {
    const data = [];
    for (let x = 0; x <= 720; x += 10) {
      const rad = (x * Math.PI) / 180; // pasar a radianes
      const y = a * Math.sin(k * rad);
      data.push({ x, y: parseFloat(y.toFixed(2)) });
    }
    return data;
  };

  const [a3, setA3] = useState(-3); // ejemplo para la gráfica
  const [k3, setK3] = useState(3);

  // Cálculos
  const amplitude = Math.abs(a3);
  const periodo = (2 * Math.PI) / k3;
  const data4 = generateData(a3, k3);

  /*  ---- CURVAS SENO Y COSENO DESPLAZADOS ----   */

  // --- Utilidades para parsear entradas que pueden ser fracciones y/o contener pi ---
  function parseFractionString(s: string): number | null {
    // acepta formatos: "3/2", "-5/3", "4"
    const m = s.match(/^([+-]?\d+)\/(\d+)$/);
    if (m) {
      const num = parseInt(m[1], 10);
      const den = parseInt(m[2], 10);
      if (den === 0) return null;
      return num / den;
    }
    const n = Number(s);
    if (!Number.isNaN(n)) return n;
    return null;
  }

  function parsePiExpression(sRaw: string): number | null {
    // Normaliza
    let s = String(sRaw).trim().replace(/\s+/g, "");
    s = s.replace(/−/g, "-"); // signo menos Unicode
    s = s.replace(/π/g, "pi");
    // regex que captura: [mult]? pi [ / denom ]?
    // ejemplos admitidos: "pi", "3pi", "3/2pi", "pi/4", "2pi/5", "-pi/6"
    const m = s.match(/^([+-]?\d+(?:\/\d+)?)?\*?pi(?:\/(\d+))?$/i);
    if (m) {
      let mult = 1;
      if (m[1]) {
        const maybeFrac = parseFractionString(m[1]);
        if (maybeFrac === null) return null;
        mult = maybeFrac;
      }
      const denom = m[2] ? parseInt(m[2], 10) : 1;
      if (denom === 0) return null;
      return (mult * Math.PI) / denom;
    }
    return null;
  }

  function parseInputToNumber(sRaw: string): number {
    // Intenta detectar expresiones con pi, fracciones o número decimal
    const s = String(sRaw).trim();
    if (s === "") return NaN;
    const piVal = parsePiExpression(s);
    if (piVal !== null) return piVal;
    const frac = parseFractionString(s);
    if (frac !== null) return frac;
    const n = Number(s);
    return Number.isNaN(n) ? NaN : n;
  }

  function approxFraction(x: number, maxDen = 48) {
    // aproxima x con num/den
    const eps = 1e-8;
    for (let den = 1; den <= maxDen; den++) {
      const num = Math.round(x * den);
      if (Math.abs(x - num / den) < eps) return { num, den };
    }
    return null;
  }

  function inputToTex(sRaw: string): string {
    const s = String(sRaw).trim();
    if (s === "") return "";
    // intenta expresar en forma de fracción con pi si corresponde
    const numeric = parseInputToNumber(s);
    if (!Number.isNaN(numeric)) {
      // si es múltiplo de pi, representarlo así
      const ratio = numeric / Math.PI;
      const frac = approxFraction(ratio, 48);
      if (frac) {
        const { num, den } = frac;
        if (den === 1) return `${num}\\pi`;
        if (num === 1) return `\\frac{\\pi}{${den}}`;
        return `\\frac{${num}\\pi}{${den}}`;
      }
      // si no es múltiplo de pi, si es fracción simple representarla con \frac
      const simpleFrac = s.match(/^([+-]?\d+)\/(\d+)$/);
      if (simpleFrac) {
        return `\\frac{${simpleFrac[1]}}{${simpleFrac[2]}}`;
      }
      // número decimal o entero
      return numeric % 1 === 0 ? `${numeric}` : numeric.toFixed(4);
    }
    // si no pudimos parsear numéricamente (entrada libre), intentamos reemplazar 'pi' por '\pi'
    return s.replace(/π/g, "\\pi").replace(/pi/g, "\\pi").replace(/\*/g, "");
  }
  // --- Generador de datos ---
  function generateData2(
    a: number,
    k: number,
    b: number,
    type: "cos" | "sin" = "cos",
    xMin = -Math.PI,
    xMax = Math.PI * 3,
    steps = 300
  ) {
    const data: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = xMin + (i / steps) * (xMax - xMin);
      const y =
        type === "cos" ? a * Math.cos(k * t - b) : a * Math.sin(k * t - b);
      data.push({ x: parseFloat(t.toFixed(4)), y: parseFloat(y.toFixed(4)) });
    }
    return data;
  }
  // Entradas como strings para permitir fracciones y pi
  const [aStr, setAStr] = useState("5");
  const [kStr, setKStr] = useState("3");
  const [bStr, setBStr] = useState("pi/4");
  const [type, setType] = useState<"cos" | "sin">("cos");

  // Parsear a valores numéricos (radianes para b)
  const aNum = parseInputToNumber(aStr);
  const kNum = parseInputToNumber(kStr);
  const bNum = parseInputToNumber(bStr);

  // seguridad: evitar k = 0
  const safeK = !Number.isNaN(kNum) && Math.abs(kNum) > 1e-12 ? kNum : NaN;

  const data5 = useMemo(() => {
    if (Number.isNaN(aNum) || Number.isNaN(safeK) || Number.isNaN(bNum))
      return [];
    return generateData2(aNum, safeK, bNum, type);
  }, [aNum, safeK, bNum, type]);

  // Valores derivables
  const amplitude2 = Number.isNaN(aNum) ? NaN : Math.abs(aNum);
  const periodNumeric = Number.isNaN(safeK) ? NaN : (2 * Math.PI) / safeK;
  const desfaseNumeric =
    Number.isNaN(safeK) || Number.isNaN(bNum) ? NaN : bNum / safeK;

  // Representaciones TeX para mostrar paso a paso sin omitir nada
  const aTex = inputToTex(aStr);
  const kTex = inputToTex(kStr);
  const bTex = inputToTex(bStr);

  // Periodo: mostrar pasos
  // Paso 1: p = 2\pi / k
  const periodoPaso1 = "p = \\frac{2\\pi}{k}";
  // Paso 2: sustitución p = 2\pi / (k_value)
  const periodoPaso2 = `p = \\frac{2\\pi}{${kTex}}`;

  // Intentar simplificar a una forma con \pi: p = (num/den)\pi
  let periodoEnPiTex = "";
  if (!Number.isNaN(periodNumeric)) {
    const ratio = periodNumeric / Math.PI; // debería ser 2/k
    const frac = approxFraction(ratio, 48);
    if (frac) {
      const { num, den } = frac;
      if (den === 1) periodoEnPiTex = `${num}\\pi`;
      else if (num === 1) periodoEnPiTex = `\\frac{\\pi}{${den}}`;
      else periodoEnPiTex = `\\frac{${num}\\pi}{${den}}`;
    }
  }

  // para mostrar valor numérico decimal
  const periodoDecimalTex = Number.isNaN(periodNumeric)
    ? "NaN"
    : periodNumeric.toFixed(6);

  // Desfase: mostrar paso detallado
  const desfasePaso1 = `${kTex}x - ${bTex} = ${kTex}\\left(x - \\frac{${bTex}}{${kTex}}\\right)`;
  // Mostrar b/k en forma simplificada (si es múltiplo de pi, representarlo como fracción de pi)
  let bOverKTex = "";
  if (!Number.isNaN(desfaseNumeric)) {
    const ratio = desfaseNumeric / Math.PI; // si es múltiplo de pi
    const frac = approxFraction(ratio, 48);
    if (frac) {
      const { num, den } = frac;
      if (den === 1) bOverKTex = `${num}\\pi`;
      else if (num === 1) bOverKTex = `\\frac{\\pi}{${den}}`;
      else bOverKTex = `\\frac{${num}\\pi}{${den}}`;
    } else {
      // si no, intentar fracción simple
      const simpleFrac = approxFraction(desfaseNumeric, 48);
      if (simpleFrac) {
        bOverKTex = `\\frac{${simpleFrac.num}}{${simpleFrac.den}}`;
      } else {
        bOverKTex = desfaseNumeric.toFixed(6);
      }
    }
  }

  const funcTex =
    type === "cos"
      ? `y = ${aTex}\\cos\\left(${kTex}x - ${bTex}\\right)`
      : `y = ${aTex}\\sin\\left(${kTex}x - ${bTex}\\right)`;

  /*  ---- Movimiento Armonico Simple ----   */

  const [amplitudeInput, setAmplitudeInput] = useState<string>("2");
  const [omegaInput, setOmegaInput] = useState<string>("3");
  const [mode, setMode] = useState<"sin" | "cos">("sin");
  // parse floats but also keep exact fractional KaTeX form using Fraction when possible
  const a4 = useMemo(
    () => Number(parseFloat(amplitudeInput) || 0),
    [amplitudeInput]
  );
  const omega = useMemo(
    () => Number(parseFloat(omegaInput) || 0),
    [omegaInput]
  );

  // derived values
  const period = omega === 0 ? Infinity : (2 * Math.PI) / omega; // p = 2π/ω
  const frequency = omega / (2 * Math.PI); // f = ω/(2π)

  const omegaTex = (() => {
    try {
      return new Fraction(omega).toFraction(true);
    } catch (e) {
      console.log(e)
      return String(omega);
    }
  })();

  const periodTex = omega === 0 ? "\\infty" : `\\frac{2\\pi}{${omegaTex}}`;
  const frequencyTex = `\\frac{${omegaTex}}{2\\pi}`;

  // numeric strings
  const periodNum = Number.isFinite(period) ? period.toFixed(6) : "∞";
  const frequencyNum = frequency.toFixed(6);

  // build data for one full period (0..p) with 200 samples or fallback when omega=0
  const data6 = useMemo(() => {
    const points: { t: number; y: number }[] = [];
    if (!Number.isFinite(period)) {
      // flat line y = a*sin(0) = 0 (if omega=0, argument is 0, so y = a*sin(0) = 0; for cos it's a)
      const defaultY = mode === "sin" ? 0 : a4;
      for (let i = 0; i <= 100; i++) points.push({ t: i / 10, y: defaultY });
      return points;
    }
    const samples = 200;
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * period;
      const arg = omega * t;
      const y = mode === "sin" ? a4 * Math.sin(arg) : a4 * Math.cos(arg);
      points.push({ t, y });
    }
    return points;
  }, [a4, omega, period, mode]);



  /*  ---- Movimiento Armonico Amortiguado ----   */

  // Función amortiguada
  function dampedHarmonic(k: number, c: number, f: number, t: number) {
    const w = 2 * Math.PI * f;
    return k * Math.exp(-c * t) * Math.cos(w * t);
  }

  // Envolventes
  function upperEnvelope(k: number, c: number, t: number) {
    return k * Math.exp(-c * t);
  }
  function lowerEnvelope(k: number, c: number, t: number) {
    return -k * Math.exp(-c * t);
  }

  // Parámetros dinámicos
  const [k2, setK2] = useState(2);
  const [c2, setC2] = useState(1.5);
  const [f2, setF2] = useState(3);

  // Cálculos derivados
  const p = useMemo(() => 1 / f2, [f2]);
  const w = useMemo(() => 2 * Math.PI *  f2, [f2]);

  // Datos para la gráfica
  const data7 = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => {
      const t = i / 100; // de 0 a 2
      return {
        t,
        y: dampedHarmonic(k2, c2, f2, t),
        upper: upperEnvelope(k2, c2, t),
        lower: lowerEnvelope(k2, c2, t),
      };
    });
  }, [k2, c2, f2]);

  return (
    <PrecalculoContext.Provider
      value={{
        //TODO: ECUACIONES
        equation,
        setEquation,
        steps,
        setSteps,
        parseCoeff,
        gcd3,
        fracSimplifyLatex,
        isPerfectSquare,
        factorSquare,
        sqrtDecompLatex,
        round2,
        solve,

        //TODO: GEOMETRIA ANALITICA
        setPuntoP,
        puntoP,
        x1,
        y1,
        puntoQ,
        setPuntoQ,
        x2,
        y2,
        distancia,
        puntoMedio,
        pendiente,
        ecuacionPasos,

        //TODO: POLIONOMIOS
        a,
        b,
        c,
        setA,
        setB,
        setC,
        useFractions,
        setUseFractions,
        paso1,
        paso2,
        paso3,
        paso4,
        paso5,
        extremo,
        h,
        k,
        formatNumber,
        data,

        //TODO: GRAFICOS DE POLINOMIOS
        gLatex,
        polynomialExpr,
        handlePolynomialChange,
        factorization,
        roots,
        criticalPoints,
        data2,
        xMin,
        xMax,

        //TODO: LIMITES SUPERIORES E INFERIORES
        hornerEval,
        gcdArray,
        toFracLatex,
        candidatesByRRT,
        syntheticDivision,
        polyToLatex,
        linFactorLatex,
        factorQuadraticInt,
        abs,
        reduceFraction,
        input,
        setInput,
        run,
        setRun,
        parsePolynomial2,
        data3,

        //TODO: DIVISION DE POLINOMIOS
        parsePolynomialDescending,
        coeffsToLatexDESC,
        longDivisionDESC,
        subtractDESC,
        scaleDESC,
        shiftDESC,
        EPS,
        P,
        setP,
        D,
        setD,
        dividend,
        divisor,
        quotientLatex,
        remainderLatex,
        result,
        error,
        VISIBLE_STEPS,

        //TODO: DESCARTE DE SIGNOS
        getCoeffsFromPolynomial,
        posiblesCerosRacionales,
        coloredLatexForTerms,
        buildSubstitutionLatex,
        buildReducedNegLatex,
        gcd2,
        signOf,
        input2,
        setInput2,
        resultado,
        setResultado,
        handleResolver,

        //TODO: NUMEROS COMPLEJOS
        sgn,
        abs2,
        isInt,
        complexLatex,
        gcd4,
        gcd5,
        fracLatex,
        add,
        sub,
        mul,
        div,
        stepsAdd,
        stepsSub,
        stepsMul,
        stepsDiv,
        powerISteps,
        a2,
        setA2,
        b2,
        setB2,
        op,
        setOp,
        exp,
        setExp,
        showFraction,
        setShowFraction,
        prettyResult,
        steps2,
        powSteps,

        //todo: IDENTIDADES FUNDAMENTALES
        simplifyFraction,
        fracLatex2,
        sinNum,
        setSinNum,
        sinDen,
        setSinDen,
        quadrant,
        setQuadrant,
        sinFrac,
        cosNumSq,
        cosDenSq,
        cosNum,
        cosDen,
        cosSimpleNumBase,
        cosSimpleDen,
        cosSimpleNum,
        cscNum,
        cscDen,
        secNum,
        secDen,
        tanNum,
        tanDen,
        cotNum,
        cotDen,

        //TODO CURVAS SENO Y COSENO
        generateData,
        a3,
        setA3,
        k3,
        setK3,
        amplitude,
        periodo,
        data4,

        //TODO CURVAS SENO Y COSENO DESPLAZADOS

        aStr,
        setAStr,
        kStr,
        setKStr,
        bStr,
        setBStr,
        type,
        setType,
        aNum,
        kNum,
        bNum,
        safeK,
        data5,
        amplitude2,
        periodNumeric,
        desfaseNumeric,
        aTex,
        kTex,
        bTex,
        periodoPaso1,
        periodoPaso2,
        periodoEnPiTex,
        periodoDecimalTex,
        desfasePaso1,
        bOverKTex,
        funcTex,

        //TODO MOVIMIENTO ARMONICO SIMPLE
        amplitudeInput,
        setAmplitudeInput,
        omegaInput,
        setOmegaInput,
        mode,
        setMode,
        a4,
        omegaTex,
        periodTex,
        frequencyTex,
        periodNum,
        frequencyNum,
        data6,

        //TODO MOVIMIENTO ARMONICO AMORTIGUADO
        k2,
        setK2,
        c2,
        setC2,
        f2,
        setF2,
        p,
        w,
        data7,
      

      }}
    >
      {children}
    </PrecalculoContext.Provider>
  );
};

export { PrecalculoProvider };

export default PrecalculoContext;
