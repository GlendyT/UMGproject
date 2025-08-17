"use client";
import React, { useMemo, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import BotonBack from "@/utils/BotonBack";

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

    const derivCoefficients = this.coefficients.slice(0, -1).map((coef, i) => {
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

const PolynomialGX: React.FC = () => {
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
  const data = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = xMin; x <= xMax + 1e-9; x += step) {
      const xx = parseFloat(x.toFixed(4));
      pts.push({ x: xx, y: g(xx) });
    }
    return pts;
  }, [g, xMin, xMax]);

  return (
    <div className="p-6 flex flex-col">
      <BotonBack />
      <h2 className="text-2xl font-bold">Gráfica de f(x) = {gLatex}</h2>

      <div className="flex flex-col gap-2 my-4">
        <label className="font-medium">Ingrese el polinomio:</label>
        <div className="flex gap-2 items-center">
          <span>f(x) =</span>
          <input
            type="text"
            value={polynomialExpr}
            onChange={handlePolynomialChange}
            className="border rounded px-2 py-1 flex-grow"
            placeholder="Ejemplo: x^3-2x^2-3x"
          />
        </div>
      </div>

      {/* PASO A PASO con react-katex */}
      <div className="flex flex-row gap-2">
        <div className="rounded-2xl border p-4 w-full">
          <div className="cursor-pointer font-semibold text-lg">
            Paso a paso (factorización y ceros)
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <BlockMath math={`f(x) = ${gLatex}`} />
            <BlockMath math={`f(x) = ${gLatex} = 0`} />
            <BlockMath math={`${factorization.expandedForm}`} />
            <BlockMath math={`${factorization.factorsForm}`} />
            <BlockMath math={`${factorization.equationForm}`} />
            <BlockMath math={`${factorization.rootsForm}`} />
          </div>
          {factorization.hasMultipleRoots && (
            <div className="mt-4 text-sm">
              <strong>Observación:</strong> la raíz \(x=
              {factorization.multipleRootValue}\) tiene multiplicidad 2 (raíz
              doble).
            </div>
          )}
        </div>

        <div className="rounded-2xl border p-4 w-full">
          <div className="w-full h-[420px]">
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[xMin, xMax]}
                  tickCount={13}
                  label={{
                    value: "x",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{ value: "f(x)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />

                <ReferenceLine y={0} stroke="#888" strokeDasharray="4 4" />

                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={false}
                  name="f(x)"
                  isAnimationActive={false}
                />

                {roots.map((r, i) => (
                  <ReferenceDot
                    key={`root-${i}`}
                    x={r.x}
                    y={r.y}
                    r={6}
                    fill="#dc2626"
                    stroke="none"
                    label={{ value: `x=${r.x}`, position: "top" }}
                  />
                ))}

                {criticalPoints.map((p, i) => (
                  <ReferenceDot
                    key={`crit-${i}`}
                    x={p.x}
                    y={p.y}
                    r={6}
                    fill={p.type === "max" ? "#16a34a" : "#f59e0b"}
                    stroke="none"
                    label={{ value: p.label, position: "top" }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolynomialGX;
