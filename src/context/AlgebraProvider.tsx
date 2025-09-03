"use client";

import Fraction from "fraction.js";
import { createContext, useState } from "react";
import {
  AlgebraContextType,
  FractionMatrix,
  Matrix3x3,
  ProviderProps,
} from "../types";

const AlgebraContext = createContext<AlgebraContextType>(null!);

const AlgebraProvider = ({ children }: ProviderProps) => {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(4).fill("0"))
  );
  const [steps, setSteps] = useState<string[]>([]);
  const [solution, setSolution] = useState<Fraction[] | null>(null);

  const handleChange = (row: number, col: number, value: string) => {
    const newMatrix = matrix.map((r) => [...r]);
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  const handleSizeChange = (n: number) => {
    setSize(n);
    setMatrix(Array.from({ length: n }, () => Array(n + 1).fill("0")));
  };

  const solve = () => {
    const m: FractionMatrix = matrix.map((row) =>
      row.map((v) => new Fraction(v))
    );

    const n = size;
    const stepLog: string[] = [];

    stepLog.push("Matriz inicial:");
    stepLog.push(printMatrix(m));

    // Eliminación hacia adelante (Gauss sin normalizar pivotes)
    for (let k = 0; k < n - 1; k++) {
      // Si el pivote es cero, intercambiar filas
      if (m[k][k].equals(0)) {
        let swapRow = -1;
        for (let r = k + 1; r < n; r++) {
          if (!m[r][k].equals(0)) {
            swapRow = r;
            break;
          }
        }
        if (swapRow !== -1) {
          [m[k], m[swapRow]] = [m[swapRow], m[k]];
          stepLog.push(`Intercambiando fila ${k + 1} con fila ${swapRow + 1}`);
          stepLog.push(printMatrix(m));
        }
      }

      // Eliminación hacia abajo
      for (let i = k + 1; i < n; i++) {
        if (m[i][k].equals(0)) continue;
        const factorA = m[k][k];
        const factorB = m[i][k];
        m[i] = m[i].map((_, j) =>
          factorA.mul(m[i][j]).sub(factorB.mul(m[k][j]))
        );
        stepLog.push(
          `Eliminando en fila ${i + 1}: F${i + 1} = (${factorA.toFraction(
            false
          )})·F${i + 1} - (${factorB.toFraction(false)})·F${k + 1}`
        );
        stepLog.push(printMatrix(m));
      }
    }

    // Verificar contradicciones
    for (let i = 0; i < n; i++) {
      const allZeroCoeffs = m[i].slice(0, n).every((val) => val.equals(0));
      if (allZeroCoeffs && !m[i][n].equals(0)) {
        stepLog.push(
          `El sistema no tiene solución (fila ${i + 1} contradictoria).`
        );
        setSolution(null);
        setSteps(stepLog);
        return;
      }
    }

    // Calcular rango
    let rank = 0;
    for (let i = 0; i < n; i++) {
      const notAllZero = m[i].slice(0, n).some((val) => !val.equals(0));
      if (notAllZero) rank++;
    }
    const infiniteSolutions = rank < n;

    // Variables para la solución
    const paramNames = infiniteSolutions
      ? Array.from({ length: n - rank }, (_, idx) => `t${idx + 1}`)
      : [];
    const x: (string | Fraction)[] = Array(n).fill(new Fraction(0));

    // Sustitución hacia atrás
    for (let i = n - 1; i >= 0; i--) {
      const pivotCol = m[i].findIndex((val, idx) => idx < n && !val.equals(0));

      if (pivotCol === -1) continue; // fila nula

      let sum = new Fraction(0);
      for (let j = pivotCol + 1; j < n; j++) {
        if (typeof x[j] === "string") {
          // Variable libre, no la sumamos como fracción
          continue;
        }
        sum = sum.add(m[i][j].mul(x[j] as Fraction));
      }

      // Determinar si hay variables libres en esta ecuación
      const hasFreeVar = m[i]
        .slice(pivotCol + 1, n)
        .some((_, j) => typeof x[pivotCol + 1 + j] === "string");

      if (hasFreeVar) {
        // Representar con parámetros
        let expr = `${m[i][n].sub(sum).div(m[i][pivotCol]).toFraction(false)}`;
        for (let j = pivotCol + 1; j < n; j++) {
          if (typeof x[j] === "string" && !m[i][j].equals(0)) {
            const coeff = m[i][j].neg().div(m[i][pivotCol]);
            expr +=
              coeff.s < 0
                ? ` - ${coeff.abs().toFraction(false)}·${x[j]}`
                : ` + ${coeff.toFraction(false)}·${x[j]}`;
          }
        }
        x[pivotCol] = expr;
      } else {
        x[pivotCol] = m[i][n].sub(sum).div(m[i][pivotCol]);
      }
    }

    // Asignar variables libres
    if (infiniteSolutions) {
      let pIndex = 0;
      for (let i = 0; i < n; i++) {
        if (
          typeof x[i] === "object" &&
          (x[i] as Fraction).equals(0) &&
          m.every((row) => row[i].equals(0))
        ) {
          x[i] = paramNames[pIndex++];
        }
      }
      stepLog.push("El sistema tiene infinitas soluciones.");
    }

    // Mostrar la solución
    stepLog.push("Solución:");
    x.forEach((val, idx) => {
      if (typeof val === "string") {
        stepLog.push(`x${idx + 1} = ${val}`);
      } else {
        stepLog.push(`x${idx + 1} = ${formatNumber(val)}`);
      }
    });

    setSolution([]); // para no romper tu estado original
    setSteps(stepLog);
  };

  const formatNumber = (val: Fraction) => {
    if (val === null) return "t";
    if (val.mod(1).equals(0)) {
      // Es un número entero, mostrar como entero
      return val.valueOf().toString();
    } else {
      // Es un número decimal, mostrar como fracción
      return val.toFraction(false);
    }
  };

  const printMatrix = (m: FractionMatrix) => {
    return m
      .map((row) =>
        row
          .map((val, idx) =>
            idx === row.length - 2
              ? formatNumber(val) + " |"
              : formatNumber(val)
          )
          .join("\t")
      )
      .join("\n");
  };

  const nuevo = () => {
    setSize(3);
    setMatrix(Array.from({ length: 3 }, () => Array(4).fill("0")));
    setSteps([]);
    setSolution(null);
  };

  // ---------------- STATE ----------------
  const [matrix2, setMatrix2] = useState<Matrix3x3>([
    [-3, 4, 2],
    [2, -1, -3],
    [4, -6, 5],
  ]);

  // Update matrix value
  const handleChange2 = (i: number, j: number, value: string) => {
    const newMatrix = matrix2.map((row) => [...row]);
    newMatrix[i][j] = parseFloat(value) || 0;
    setMatrix2(newMatrix);
  };

  // ---------------- CÁLCULOS ----------------
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix2;
  const extended = [...matrix2, ...matrix2.slice(0, 2)];

  // Productos diagonales (principales ↘ y secundarias ↙)
  const main = [
    { expr: `${a}·${e}·${i}`, val: a * e * i },
    { expr: `${b}·${f}·${g}`, val: b * f * g },
    { expr: `${c}·${d}·${h}`, val: c * d * h },
  ];
  const sec = [
    { expr: `${c}·${e}·${g}`, val: c * e * g },
    { expr: `${a}·${f}·${h}`, val: a * f * h },
    { expr: `${b}·${d}·${i}`, val: b * d * i },
  ];

  const det =
    main.reduce((s, x) => s + x.val, 0) - sec.reduce((s, x) => s + x.val, 0);

  const expr = `
    \\text{Det} =
    (${main.map((m) => (m.val >= 0 ? `+${m.val}` : m.val)).join(" ")})
    - (${sec.map((m) => (m.val >= 0 ? `+${m.val}` : m.val)).join(" ")})
    = ${det}
  `;

  // ---------------- DIBUJO ----------------
  const cell = 50;
  const gap = 12;
  const rows = 5;
  const cols = 3;
  const W = cols * cell + (cols - 1) * gap;
  const H = rows * cell + (rows - 1) * gap;

  const cx = (j: number) => j * (cell + gap) + cell / 2;
  const cy = (i: number) => i * (cell + gap) + cell / 2;

  const redLines = [
    { i: 0, j: 0, text: main[0].val },
    { i: 1, j: 0, text: main[1].val },
    { i: 2, j: 0, text: main[2].val },
  ];
  const blueLines = [
    { i: 0, j: 2, text: sec[0].val },
    { i: 1, j: 2, text: sec[1].val },
    { i: 2, j: 2, text: sec[2].val },
  ];

  return (
    <AlgebraContext.Provider
      value={{
        size,
        setSize,
        matrix,
        setMatrix,
        steps,
        setSteps,
        solution,
        setSolution,
        handleChange,
        handleSizeChange,
        solve,
        formatNumber,
        printMatrix,
        nuevo,
        matrix2,
        setMatrix2,
        handleChange2,
        extended,
        expr,
        redLines,
        blueLines,
        cell,
        gap,
        rows,
        cols,
        W,
        H,
        cx,
        cy,
      }}
    >
      {children}
    </AlgebraContext.Provider>
  );
};

export { AlgebraProvider };
export default AlgebraContext;
