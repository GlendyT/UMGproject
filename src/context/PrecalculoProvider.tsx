"use client";
import "katex/dist/katex.min.css";
import { createContext, useState, JSX, useMemo, useCallback } from "react";
import { PrecalculoContextType, ProviderProps } from "../types";
import StepsPrecalculo from "@/components/StepsPrecalculo";
import Steps2Precalculo from "@/components/Steps2Precalculo";
import Fraction from "fraction.js";

const PrecalculoContext = createContext<PrecalculoContextType>(null!);

const PrecalculoProvider = ({ children }: ProviderProps) => {
  //TODO: Ecuaciones
  function parseCoeff(raw: string, defOne = 1) {
    if (raw === undefined) return NaN;
    if (raw === "" || raw === "+") return defOne;
    if (raw === "-") return -defOne;
    return Number(raw);
  }
  const [equation, setEquation] = useState("1x^4-8x^2+2=0");
  const round2 = (v: number) => Number(v.toFixed(2));
  let steps: JSX.Element | null = null;
  try {
    const cleaned = equation.replace(/\s+/g, "").replace(/=0$/, "");
    // --- INTENTO 1: forma bicuadrada EXACTA de la imagen: a x^4 + b x^2 + c = 0 ---
    const biquadExact = cleaned.match(
      /^([+-]?\d*)x\^4([+-]?\d*)x\^2([+-]?\d+)$/i
    );
    if (biquadExact) {
      const a = parseCoeff(biquadExact[1], 1);
      const b = parseCoeff(biquadExact[2], 1);
      const c = parseCoeff(biquadExact[3], 0);

      if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) {
        steps = <p className="text-red-500">Coeficientes inválidos.</p>;
      } else {
        // Sustitución w = x^2 → a w^2 + b w + c = 0
        const b2 = b * b;
        const fourac = 4 * a * c;
        const disc = b2 - fourac;
        const sqrtDisc = Math.sqrt(Math.max(0, disc));
        const sqrtDiscR = round2(sqrtDisc);
        const twoA = 2 * a;

        // Para replicar el estilo de la imagen, usamos la raíz redondeada para los siguientes cocientes
        const w1_disp = (-b + sqrtDiscR) / twoA;
        const w2_disp = (-b - sqrtDiscR) / twoA;
        const w1R = round2(w1_disp);
        const w2R = round2(w2_disp);

        // Paso 3: volver a x (x^2 = w)
        const x1R = w1R >= 0 ? round2(Math.sqrt(w1R)) : NaN;
        const x2R = w1R >= 0 ? -x1R : NaN;
        const x3R = w2R >= 0 ? round2(Math.sqrt(w2R)) : NaN;
        steps = (
          <StepsPrecalculo
            a={a}
            b={b}
            c={c}
            b2={b2}
            fourac={fourac}
            disc={disc}
            sqrtDiscR={sqrtDiscR}
            twoA={twoA}
            w1R={w1R}
            w2R={w2R}
            x1R={x1R}
            x2R={x2R}
            x3R={x3R}
            round2={round2}
          />
        );
      }
    } else {
      // --- INTENTO 2: cuadrática estándar a x^2 + b x + c = 0 ---
      const quad = cleaned.match(/^([+-]?\d*)x\^2([+-]?\d*)x([+-]?\d+)$/i);
      if (quad) {
        const a = parseCoeff(quad[1], 1);
        const b = parseCoeff(quad[2], 1);
        const c = parseCoeff(quad[3], 0);

        if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) {
          steps = <p className="text-red-500">Coeficientes inválidos.</p>;
        } else {
          const b2 = b * b;
          const fourac = 4 * a * c;
          const disc = b2 - fourac;
          const sqrtDisc = Math.sqrt(Math.max(0, disc));
          const sqrtDiscR = round2(sqrtDisc);
          const twoA = 2 * a;

          const x1_disp = (-b + sqrtDiscR) / twoA;
          const x2_disp = (-b - sqrtDiscR) / twoA;
          const x1R = round2(x1_disp);
          const x2R = round2(x2_disp);

          steps = (
            <Steps2Precalculo
              a={a}
              b={b}
              c={c}
              b2={b2}
              fourac={fourac}
              disc={disc}
              sqrtDiscR={sqrtDiscR}
              twoA={twoA}
              x1R={x1R}
              x2R={x2R}
              round2={round2}
            />
          );
        }
      } else {
        steps = (
          <p className="text-red-500">
            Formato no reconocido. Ejemplos:{" "}
            <span className="font-mono">x^4-8x^2+2=0</span>,{" "}
            <span className="font-mono">2x^2+3x-1=0</span>
          </p>
        );
      }
    }
  } catch (err) {
    steps = <p className="text-red-500">Error al procesar la ecuación.</p>;
  }

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

  // Forma normal paso a paso
  // f(x) = ax^2 + bx + c
  // completando el cuadrado
  const paso1 = `f(x) = ${a}x^2 + ${b}x + ${c}`;
  const paso2 = `f(x) = ${a}\\left(x^2 + \\frac{${b}}{${a}}x\\right) + ${c}`;
  const paso3 = `f(x) = ${a}\\left(x^2 + ${formatNumber(
    b / a
  )}x + \\left(\\frac{${b}}{2${a}}\\right)^2 - \\left(\\frac{${b}}{2${a}}\\right)^2\\right) + ${c}`;
  const paso4 = `f(x) = ${a}\\left((x + \\frac{${b}}{2${a}})^2 - \\left(\\frac{${b}}{2${a}}\\right)^2\\right) + ${c}`;
  const paso5 = `f(x) = ${a}(x - (${formatNumber(h)}))^2 + ${formatNumber(k)}`;

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
          expandedForm: "x^3-2x^2-3x = x(x^2-2x-3)",
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

  return (
    <PrecalculoContext.Provider
      value={{
        //TODO: ECUACIONES
        equation,
        setEquation,
        steps,

        //TODO: GEOMETRIA ANALITICA
        setPuntoP,
        puntoP,
        round2,
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
      }}
    >
      {children}
    </PrecalculoContext.Provider>
  );
};

export { PrecalculoProvider };

export default PrecalculoContext;
