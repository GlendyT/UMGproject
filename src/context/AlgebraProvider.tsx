"use client";

import Fraction from "fraction.js";
import { createContext, useState } from "react";
import {
  AlgebraContextType,
  FractionMatrix,
  Matrix,
  Matrix3x3,
  MinorStep,
  ProviderProps,
  StepData,
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

  // ---------------- MÉTODO DE CRAMER ----------------
   const [size2, setSize2] = useState<number>(3);
  const [matrix3, setMatrix3] = useState<Matrix>([
    [-1, 2, 4, 1],
    [4, 6, -2, 2],
    [1, -1, 6, 3],
  ]);
  const [result, setResult] = useState<{
    det: Fraction;
    detVars: Fraction[];
    sols: Fraction[];
  } | null>(null);
  const [showFraction, setShowFraction] = useState(true);

  // Función de determinante usando Fraction para precisión exacta
  const determinant = (m: Matrix): Fraction => {
    const n = m.length;
    if (n === 1) return new Fraction(m[0][0]);
    if (n === 2)
      return new Fraction(m[0][0])
        .mul(m[1][1])
        .sub(new Fraction(m[0][1]).mul(m[1][0]));
    if (n === 3) {
      // Sarrus con Fraction exacta
      const a = new Fraction(m[0][0]).mul(m[1][1]).mul(m[2][2]);
      const b = new Fraction(m[0][1]).mul(m[1][2]).mul(m[2][0]);
      const c = new Fraction(m[0][2]).mul(m[1][0]).mul(m[2][1]);
      const d = new Fraction(m[0][2]).mul(m[1][1]).mul(m[2][0]);
      const e = new Fraction(m[0][0]).mul(m[1][2]).mul(m[2][1]);
      const f = new Fraction(m[0][1]).mul(m[1][0]).mul(m[2][2]);
      return a.add(b).add(c).sub(d).sub(e).sub(f);
    }
    // Recursivo 4x4+
    let det = new Fraction(0);
    for (let j = 0; j < n; j++) {
      const minor: Matrix = m
        .slice(1)
        .map((row) => row.filter((_, c) => c !== j));
      const sign = j % 2 === 0 ? new Fraction(1) : new Fraction(-1);
      det = det.add(sign.mul(new Fraction(m[0][j])).mul(determinant(minor)));
    }
    return det;
  };

  const determinantExpression = (m: Matrix): string => {
    const n = m.length;
    if (n === 1) return `${m[0][0]}`;
    if (n === 2)
      return `${m[0][0]}*${m[1][1]} - ${m[0][1]}*${m[1][0]} = ${determinant(
        m
      ).toFraction(false)}`;
    if (n === 3) {
      const a = new Fraction(m[0][0]).mul(m[1][1]).mul(m[2][2]);
      const b = new Fraction(m[0][1]).mul(m[1][2]).mul(m[2][0]);
      const c = new Fraction(m[0][2]).mul(m[1][0]).mul(m[2][1]);
      const d = new Fraction(m[0][2]).mul(m[1][1]).mul(m[2][0]);
      const e = new Fraction(m[0][0]).mul(m[1][2]).mul(m[2][1]);
      const f = new Fraction(m[0][1]).mul(m[1][0]).mul(m[2][2]);
      return `(${a.toFraction(false)}) + (${b.toFraction(
        false
      )}) + (${c.toFraction(false)}) - (${d.toFraction(
        false
      )}) - (${e.toFraction(false)}) - (${f.toFraction(false)}) = ${determinant(
        m
      ).toFraction(false)}`;
    }
    // 4x4+
    const terms: string[] = [];
    for (let j = 0; j < n; j++) {
      const minor: Matrix = m
        .slice(1)
        .map((row) => row.filter((_, c) => c !== j));
      const sign = j % 2 === 0 ? "" : "-";
      terms.push(`${sign}${m[0][j]}*(${determinantExpression(minor)})`);
    }
    return terms.join(" + ");
  };

  const solve3 = () => {
    const coeffs: Matrix = matrix3.map((row) => row.slice(0, size2));
    const constants: Fraction[] = matrix3.map((row) => new Fraction(row[size2]));

    const det = determinant(coeffs);
    if (det.equals(0)) {
      alert("El determinante es cero, el sistema no tiene solución única.");
      return;
    }

    const detVars: Fraction[] = [];
    const sols: Fraction[] = [];

    for (let i = 0; i < size2; i++) {
      const modified: Matrix = coeffs.map((row, r) =>
        row.map((val, c) => (c === i ? constants[r] : val))
      );
      const detVar = determinant(modified);
      detVars.push(detVar);
      sols.push(detVar.div(det));
    }

    setResult({ det, detVars, sols });
  };

  const handleChange3 = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const newMatrix = [...matrix3];
    newMatrix[row][col] = Number(e.target.value);
    setMatrix3(newMatrix);
  };

  const handleSizeChange3 = (newSize: number) => {
    setSize2(newSize);
    const newMatrix: Matrix = Array.from({ length: newSize }, () =>
      Array(newSize + 1).fill(0)
    );
    setMatrix3(newMatrix);
    setResult(null);
  };

  const matrixToString = (m: Matrix) =>
    m.map((row) => row.join(" & ")).join(" \\\\ ");


  /----------------- Metodo de Laplace ----------------/

    const [size4, setSize4] = useState(3);
  const [matrix4, setMatrix4] = useState([
    [-3, 4, 2],
    [2, -1, -3],
    [4, -6, 5],
  ]);

  const [mode, setMode] = useState("col");
  const [index, setIndex] = useState(2);

  const handleChange4 = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const newMatrix = [...matrix4];
    newMatrix[row][col] = parseInt(e.target.value);
    setMatrix4(newMatrix);
  };

  const handleSizeChange4 = (newSize: number) => {
    setSize4(newSize);
    setIndex(0);
    const newMatrix = Array(newSize)
      .fill(0)
      .map(() => Array(newSize).fill(0));
    setMatrix4(newMatrix);
  };

  const calculateDet = (
    m: number[][],
    showSteps = false
  ): number | { value: number; steps: string | MinorStep[] } => {
    const n = m.length;
    if (n === 2) {
      const result = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      if (showSteps) {
        return {
          value: result,
          steps: `(${m[0][0]}) × (${m[1][1]}) - (${m[0][1]}) × (${m[1][0]}) = ${
            m[0][0] * m[1][1]
          } - ${m[0][1] * m[1][0]} = ${result}`,
        };
      }
      return result;
    }

    let det = 0;
    const detailSteps: MinorStep[] = [];

    for (let j = 0; j < n; j++) {
      const sign = j % 2 === 0 ? 1 : -1;
      const minor = m.slice(1).map((row) => row.filter((_, c) => c !== j));
      const minorResult = calculateDet(minor, showSteps && n === 3);
      const minorValue =
        showSteps && n === 3 && typeof minorResult === "object"
          ? minorResult.value
          : minorResult;

      if (showSteps && n === 3) {
        detailSteps.push({
          element: m[0][j],
          sign,
          minor,
          minorValue: typeof minorValue === "number" ? minorValue : 0,
          minorSteps:
            typeof minorResult === "object" &&
            "steps" in minorResult &&
            typeof minorResult.steps === "string"
              ? minorResult.steps
              : "",
          term:
            sign * m[0][j] * (typeof minorValue === "number" ? minorValue : 0),
        });
      }

      det += sign * m[0][j] * (typeof minorValue === "number" ? minorValue : 0);
    }

    if (showSteps && n === 3) {
      return { value: det, steps: detailSteps };
    }

    return det;
  };

  const laplaceDet = () => {
    let det2 = 0;
    const steps2: StepData[] = [];

    if (mode === "col") {
      for (let i = 0; i < size4; i++) {
        const sign = (i + index) % 2 === 0 ? 1 : -1;
        const element = matrix4[i][index];

        const minor = matrix4
          .filter((_, r) => r !== i)
          .map((row) => row.filter((_, c) => c !== index));

        const minorResult =
          size === 4 && minor.length === 3
            ? calculateDet(minor, true)
            : calculateDet(minor);
        const minorValue =
          typeof minorResult === "object" ? minorResult.value : minorResult;
        const term = sign * element * minorValue;

        steps2.push({
          element,
          sign,
          minor,
          minorValue: typeof minorValue === "number" ? minorValue : 0,
          term,
          minorSteps:
            typeof minorResult === "object" ? minorResult.steps : null,
        });
        det2 += term;
      }
    } else {
      for (let j = 0; j < size4; j++) {
        const sign = (index + j) % 2 === 0 ? 1 : -1;
        const element = matrix4[index][j];

        const minor = matrix4
          .filter((_, r) => r !== index)
          .map((row) => row.filter((_, c) => c !== j));

        const minorResult =
          size4 === 4 && minor.length === 3
            ? calculateDet(minor, true)
            : calculateDet(minor);
        const minorValue =
          typeof minorResult === "object" ? minorResult.value : minorResult;
        const term = sign * element * minorValue;

        steps2.push({
          element,
          sign,
          minor,
          minorValue: typeof minorValue === "number" ? minorValue : 0,
          term,
          minorSteps:
            typeof minorResult === "object" ? minorResult.steps : null,
        });
        det2 += term;
      }
    }

    return { det2, steps2 };
  };

  const { det2, steps2 } = laplaceDet();

  const signMatrix: string[][] = Array(size4)
    .fill(0)
    .map((_, i) =>
      Array(size4)
        .fill(0)
        .map((_, j) => ((i + j) % 2 === 0 ? "+" : "-"))
    );


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
        size2,
        setSize2,
        matrix3,
        setMatrix3,
        result,
        setResult,
        showFraction,
        setShowFraction,
        solve3,
        handleChange3,
        handleSizeChange3,
        matrixToString,
        determinantExpression,
        size4,
        setSize4,
        matrix4,
        setMatrix4,
        mode,
        setMode,
        index,
        setIndex,
        handleChange4,
        handleSizeChange4,
        calculateDet,
        laplaceDet,
        det2,
        steps2,
        signMatrix,
      }}
    >
      {children}
    </AlgebraContext.Provider>
  );
};

export { AlgebraProvider };
export default AlgebraContext;
