"use client";

import Fraction from "fraction.js";
import { createContext, JSX, useMemo, useState } from "react";
import {
  AlgebraContextType,
  FractionMatrix,
  Matrix,
  Matrix3x3,
  MinorStep,
  Mode2,
  ProviderProps,
  StepData,
} from "../types";
import { InlineMath } from "react-katex";
import { Chart, registerables } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(...registerables);
Chart.register(annotationPlugin);

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
    const constants: Fraction[] = matrix3.map(
      (row) => new Fraction(row[size2])
    );

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

  /----------------- Metodo de Laplace ----------------/;

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

  /----------------- Vectores ----------------/;

  function deg2rad(d: number) {
    return (d * Math.PI) / 180;
  }
  function rad2deg(r: number) {
    return (r * 180) / Math.PI;
  }
  function norm360(a: number) {
    return ((a % 360) + 360) % 360;
  }

  /* Parse cardinal formats like: "N 60 O", "E 30 N", or direct degrees "30" */
  function parseCardinal(input: string): {
    angleDeg: number;
    parsed: boolean;
    explanation: string;
  } {
    const s = input.trim().replace(/°/g, "").toUpperCase();
    if (/^-?\d+(\.?\d+)?$/.test(s)) {
      const angleDeg = parseFloat(s);
      return {
        angleDeg: norm360(angleDeg),
        parsed: true,
        explanation: `Ángulo directo: ${angleDeg}° (desde +x).`,
      };
    }
    const m = s.match(/^([NS])\s*(\d+(\.?\d+)?)\s*([EO])$/);
    if (m) {
      const ns = m[1];
      const ang = parseFloat(m[2]);
      const eo = m[4];
      let angleFromEast = 0;
      if (ns === "N" && eo === "E") angleFromEast = 90 - ang;
      if (ns === "N" && eo === "O") angleFromEast = 90 + ang;
      if (ns === "S" && eo === "E") angleFromEast = 270 - ang;
      if (ns === "S" && eo === "O") angleFromEast = 270 + ang;
      return {
        angleDeg: norm360(angleFromEast),
        parsed: true,
        explanation: `Convertido a ${norm360(angleFromEast)}° desde +x.`,
      };
    }
    const m2 = s.match(/^([EO])\s*(\d+(\.?\d+)?)\s*([NS])$/);
    if (m2) {
      const eo = m2[1];
      const ang = parseFloat(m2[2]);
      const ns = m2[4];
      let angleFromEast = 0;
      if (eo === "E" && ns === "N") angleFromEast = 0 + ang;
      if (eo === "E" && ns === "S") angleFromEast = 360 - ang;
      if (eo === "O" && ns === "N") angleFromEast = 180 - ang;
      if (eo === "O" && ns === "S") angleFromEast = 180 + ang;
      return {
        angleDeg: norm360(angleFromEast),
        parsed: true,
        explanation: `Convertido a ${norm360(angleFromEast)}° desde +x.`,
      };
    }
    return {
      angleDeg: 0,
      parsed: false,
      explanation:
        "No se pudo interpretar. Use grados (ej. 30) o cardinal (ej. N 60 O).",
    };
  }

  /* ---------- math & step functions (devuelven strings LaTeX-friendly) ---------- */

  function polarToComponentsSteps(magStr: string, angleStr: string) {
    const steps: JSX.Element[] = [];
    const m = parseFloat(magStr);

    const parsed = parseCardinal(angleStr);
    if (!parsed.parsed) {
      steps.push(<div key="error">ERROR: {parsed.explanation}</div>);
      return { steps, x: NaN, y: NaN };
    }

    const angleDeg = parsed.angleDeg;
    const rad = deg2rad(angleDeg);
    const x = m * Math.cos(rad);
    const y = m * Math.sin(rad);
    steps.push(
      <div key="step4" className="flex flex-col">
        <InlineMath math={`V_x  = ${m} \\cdot \\cos(${angleDeg}^\\circ) `} />
        <InlineMath math={`V_x  = ${x.toFixed(2)}`} />
      </div>
    );
    steps.push(
      <div key="step4b" className="flex flex-col">
        <InlineMath math={`V_y = ${m} \\cdot \\sin(${angleDeg}^\\circ) `} />
        <InlineMath math={`V_y  = ${y.toFixed(2)}`} />
      </div>
    );
    steps.push(
      <div key="step5">
        Resultado:{" "}
        <InlineMath math={`V = (${x.toFixed(2)},\\; ${y.toFixed(2)})`} />
      </div>
    );
    return { steps, x, y };
  }

  function componentsToPolarSteps(xStr: string, yStr: string) {
    const steps: JSX.Element[] = [];
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    const mag = Math.hypot(x, y);
    steps.push(
      <div key="step2">
        <InlineMath math={`|V| = \\sqrt{${x}^2 + ${y}^2} `} />
        <InlineMath math={` = ${mag}`} />
      </div>
    );
    const angleRad = Math.atan2(y, x);
    const angleDeg = norm360(rad2deg(angleRad));
    steps.push(
      <div key="step3">
        <InlineMath
          math={`\\theta = \\operatorname\\arctan(\\frac{V_y}{ V_x}) \\ = \\operatorname\\arctan(\\frac${y} ${x}) = \\  ${angleDeg.toFixed(
            2
          )}^\\circ`}
        />
      </div>
    );
    return { steps, mag, angleDeg };
  }

  function sumVectorsSteps(
    vecs: { x?: string; y?: string; mag?: string; angle?: string }[]
  ) {
    const steps: JSX.Element[] = [];
    let sumX = 0;
    let sumY = 0;
    vecs.forEach((v, i) => {
      if (v.x !== undefined && v.y !== undefined && v.x !== "" && v.y !== "") {
        const xv = parseFloat(v.x);
        const yv = parseFloat(v.y);
        sumX += xv;
        sumY += yv;
      } else if (
        v.mag !== undefined &&
        v.angle !== undefined &&
        v.mag !== "" &&
        v.angle !== ""
      ) {
        const { steps: s2, x, y } = polarToComponentsSteps(v.mag, v.angle);
        s2.forEach((t, j) => steps.push(<div key={`vec${i}-${j}`}> {t}</div>));
        sumX += x;
        sumY += y;
      } else {
        steps.push(
          <div key={`vec${i}`}>- Vector {i + 1}: formato no reconocido.</div>
        );
      }
    });
    steps.push(
      <div key="sum" className="flex flex-col">
        <InlineMath math={`\\Sigma V_x = ${sumX.toFixed(2)}`} />
        <InlineMath math={` \\Sigma V_y = ${sumY.toFixed(2)}`} />
      </div>
    );
    const mag = Math.hypot(sumX, sumY);
    const angleDeg = norm360(rad2deg(Math.atan2(sumY, sumX)));
    steps.push(
      <div key="result">
        3) Resultante:{" "}
        <InlineMath math={`R = (${sumX.toFixed(2)},\\; ${sumY.toFixed(2)})`} />
      </div>
    );
    steps.push(
      <div key="mag" className="flex flex-col">
        <InlineMath
          math={`|R| = \\sqrt{${sumX.toFixed(2)}^2 + ${sumY.toFixed(2)}^2} `}
        />
        <InlineMath math={`|R| = ${mag.toFixed(2)}`} />
      </div>
    );
    steps.push(
      <div key="angle">
        5) <InlineMath math={`\\theta = ${angleDeg.toFixed(2)}^\\circ`} />
      </div>
    );
    steps.push(
      <div key="polar">
        6) Resultado polar:{" "}
        <InlineMath
          math={`|R|=${mag.toFixed(2)},\\; \\theta=${angleDeg.toFixed(
            2
          )}^\\circ`}
        />
      </div>
    );
    return { steps, sumX, sumY, mag, angleDeg };
  }

  function scalarMultiplySteps(
    sStr: string,
    v: { x?: string; y?: string; mag?: string; angle?: string }
  ) {
    const steps: JSX.Element[] = [];
    const s = parseFloat(sStr);
    if (v.x !== undefined && v.y !== undefined && v.x !== "" && v.y !== "") {
      const x = parseFloat(v.x);
      const y = parseFloat(v.y);
      steps.push(
        <div key="vector">
          2) Vector: <InlineMath math={`${x},\\; ${y}`} />
        </div>
      );
      const xr = s * x;
      const yr = s * y;
      steps.push(
        <div key="multiply">
          3) <InlineMath math={`${s} \\cdot (${x}, ${y}) = (${xr}, ${yr})`} />
        </div>
      );
      steps.push(
        <div key="result">
          4) Resultado:{" "}
          <InlineMath math={`${xr.toFixed(2)},\\; ${yr.toFixed(2)}`} />
        </div>
      );
      return { steps, xr, yr };
    } else if (
      v.mag !== undefined &&
      v.angle !== undefined &&
      v.mag !== "" &&
      v.angle !== ""
    ) {
      const m = parseFloat(v.mag);
      const { steps: s2, x, y } = polarToComponentsSteps(v.mag, v.angle);
      s2.forEach((t, i) => steps.push(<div key={`polar${i}`}> {t}</div>));
      const xr = s * x;
      const yr = s * y;
      steps.push(
        <div key="newmag" className="flex flex-col">
           Magnitud nueva: <InlineMath math={`|V| = ${s} \\cdot ${m} `} />
          <InlineMath math={`|V| = ${Math.abs(s * m)}   `} />
        </div>
      );
      steps.push(
        <div key="result">
          4) Resultado en componentes:{" "}
          <InlineMath math={`${xr.toFixed(2)},\\; ${yr.toFixed(2)}`} />
        </div>
      );
      return { steps, xr, yr };
    }
    steps.push(<div key="error">Formato vector no reconocido.</div>);
    return { steps };
  }

  function angleBetweenSteps(
    a: { x?: string; y?: string; mag?: string; angle?: string },
    b: { x?: string; y?: string; mag?: string; angle?: string }
  ) {
    const steps: JSX.Element[] = [];
    function ensureComponents(
      v: { x?: string; y?: string; mag?: string; angle?: string },
      idx: number
    ) {
      if (v.x !== undefined && v.y !== undefined && v.x !== "" && v.y !== "")
        return {
          x: parseFloat(v.x),
          y: parseFloat(v.y),
          steps: [
          ],
        };
      if (
        v.mag !== undefined &&
        v.angle !== undefined &&
        v.mag !== "" &&
        v.angle !== ""
      ) {
        const { steps: s2, x, y } = polarToComponentsSteps(v.mag, v.angle);
        return {
          x,
          y,
          steps: [
            ...s2,
          ],
        };
      }
      return {
        x: NaN,
        y: NaN,
        steps: [
          <div key={`vec${idx}`}>- Vector {idx}: formato no reconocido.</div>,
        ],
      };
    }
    const A = ensureComponents(a, 1);
    const B = ensureComponents(b, 2);
    A.steps.forEach((t, i) => steps.push(<div key={`A${i}`}> {t}</div>));
    B.steps.forEach((t, i) => steps.push(<div key={`B${i}`}> {t}</div>));
    steps.push(
      <div key="dot">
        2) Producto punto: <InlineMath math={`A\\cdot B = A_x B_x + A_y B_y`} />
        .
      </div>
    );
    const dot = A.x * B.x + A.y * B.y;
    steps.push(
      <div key="dotcalc">
        <InlineMath
          math={`A\\cdot B = ${A.x.toFixed(2)}\\cdot ${B.x.toFixed(
            2
          )} + ${A.y.toFixed(2)}\\cdot ${B.y.toFixed(2)} = ${dot.toFixed(2)}`}
        />
      </div>
    );
    const magA = Math.hypot(A.x, A.y);
    const magB = Math.hypot(B.x, B.y);
    steps.push(
      <div key="norms">
        3) Normas:{" "}
        <InlineMath
          math={`|A|=${magA.toFixed(2)},\\; |B|=${magB.toFixed(2)}`}
        />
      </div>
    );
    const cosTheta = dot / (magA * magB);
    const cosClamped = Math.max(-1, Math.min(1, cosTheta));
    const thetaDeg = rad2deg(Math.acos(cosClamped));
    steps.push(
      <div key="angle">
        4){" "}
        <InlineMath
          math={`\\cos\\theta = ${cosClamped.toFixed(
            2
          )} \\Rightarrow \\theta = \\arccos(${cosClamped.toFixed(
            2
          )}) = ${thetaDeg.toFixed(2)}^\\circ`}
        />
      </div>
    );
    return { steps, thetaDeg };
  }

  function unitVectorSteps(v: {
    x?: string;
    y?: string;
    mag?: string;
    angle?: string;
  }) {
    const steps: JSX.Element[] = [];
    let A: { x: number; y: number; steps: JSX.Element[] } | null = null;
    if (v.x !== undefined && v.y !== undefined && v.x !== "" && v.y !== "")
      A = {
        x: parseFloat(v.x),
        y: parseFloat(v.y),
        steps: [
          <div key="vec">
            - Vector: ({v.x}, {v.y}).
          </div>,
        ],
      };
    else if (
      v.mag !== undefined &&
      v.angle !== undefined &&
      v.mag !== "" &&
      v.angle !== ""
    ) {
      const { steps: s2, x, y } = polarToComponentsSteps(v.mag, v.angle);
      A = {
        x,
        y,
        steps: [
          ...s2,
        ],
      };
    } else {
      steps.push(<div key="error">Formato no reconocido.</div>);
      return { steps };
    }
    A!.steps.forEach((t: JSX.Element, i: number) =>
      steps.push(<div key={`A${i}`}> {t}</div>)
    );
    const mag = Math.hypot(A!.x, A!.y);
    steps.push(
      <div key="mag">
        2) <InlineMath math={`|V| = ${mag.toFixed(6)}`} />
      </div>
    );
    const ux = A!.x / mag;
    const uy = A!.y / mag;
    steps.push(
      <div key="unit">
        3) Vector unitario:{" "}
        <InlineMath
          math={`\\hat{u} = (${ux.toFixed(6)},\\; ${uy.toFixed(6)})`}
        />
      </div>
    );
    return { steps, ux, uy };
  }

  /* ---------- Chart arrow plugin ---------- */
  /* Plugin draws arrow lines between the dataset first and last point when dataset.drawArrow === true */
  interface ChartInstance {
    ctx: CanvasRenderingContext2D;
    data: {
      datasets: Array<{
        drawArrow?: boolean;
        arrowColor?: string;
        borderColor?: string;
        lineWidth?: number;
      }>;
    };
    getDatasetMeta: (index: number) => {
      data: Array<{
        getProps: (props: string[], final: boolean) => { x: number; y: number };
      }>;
    };
  }

  const arrowPlugin = {
    id: "arrowPlugin",
    afterDatasetsDraw: (chart: ChartInstance) => {
      const ctx = chart.ctx;
      chart.data.datasets.forEach((dataset, dsIndex: number) => {
        if (!dataset.drawArrow) return;
        const meta = chart.getDatasetMeta(dsIndex);
        const points = meta.data;
        if (!points || points.length < 2) return;
        const start = points[0].getProps(["x", "y"], true);
        const end = points[points.length - 1].getProps(["x", "y"], true);
        const fromX = start.x,
          fromY = start.y,
          toX = end.x,
          toY = end.y;
        const headlen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = dataset.arrowColor || dataset.borderColor || "black";
        ctx.lineWidth = dataset.lineWidth || 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headlen * Math.cos(angle - Math.PI / 6),
          toY - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - headlen * Math.cos(angle + Math.PI / 6),
          toY - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = dataset.arrowColor || dataset.borderColor || "black";
        ctx.fill();
        ctx.restore();
      });
    },
  };
  Chart.register(arrowPlugin);

  const [mode2, setMode2] = useState<Mode2>("polar-to-components");
  const [mag, setMag] = useState<string>("10");
  const [angleInput, setAngleInput] = useState<string>("30");
  const [xComp, setXComp] = useState<string>("6");
  const [yComp, setYComp] = useState<string>("8");
  const [vectors, setVectors] = useState<
    { mag?: string; angle?: string; x?: string; y?: string }[]
  >([
    { mag: "3", angle: "30" },
    { x: "-3", y: "4" },
  ]);
  const [scalar, setScalar] = useState<string>("-2");
  const [output, setOutput] = useState<JSX.Element[]>([]);

  function vecToXY(v: {
    mag?: string;
    angle?: string;
    x?: string;
    y?: string;
  }) {
    if (v.x !== undefined && v.y !== undefined && v.x !== "" && v.y !== "")
      return { x: parseFloat(v.x), y: parseFloat(v.y) };
    if (
      v.mag !== undefined &&
      v.angle !== undefined &&
      v.mag !== "" &&
      v.angle !== ""
    ) {
      const { x, y } = polarToComponentsSteps(v.mag, v.angle);
      return { x, y };
    }
    return null;
  }

  const chartDataAndOptions = useMemo(() => {
    const datasets: Array<{
      label: string;
      data: Array<{ x: number; y: number }>;
      drawArrow?: boolean;
      arrowColor?: string;
      borderColor?: string;
      borderWidth?: number;
      pointRadius?: number;
      borderDash?: number[];
    }> = [];
    const xs: number[] = [0];
    const ys: number[] = [0];

    if (mode2 === "polar-to-components") {
      const v = vecToXY({ mag, angle: angleInput });
      if (v) {
        datasets.push({
          label: "V",
          data: [
            { x: 0, y: 0 },
            { x: v.x, y: v.y },
          ],
          drawArrow: true,
          arrowColor: "blue",
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 0,
        });
        xs.push(v.x);
        ys.push(v.y);
      }
    }

    if (mode2 === "components-to-polar") {
      const v = vecToXY({ x: xComp, y: yComp });
      if (v) {
        datasets.push({
          label: "V",
          data: [
            { x: 0, y: 0 },
            { x: v.x, y: v.y },
          ],
          drawArrow: true,
          arrowColor: "blue",
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 0,
        });
        xs.push(v.x);
        ys.push(v.y);
      }
    }

    if (mode2 === "sum-vectors" || mode2 === "subtract-vectors") {
      const v1 = vecToXY(vectors[0] || {});
      const v2 = vecToXY(vectors[1] || {});
      if (v1) {
        datasets.push({
          label: "V1",
          data: [
            { x: 0, y: 0 },
            { x: v1.x, y: v1.y },
          ],
          drawArrow: true,
          arrowColor: "blue",
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 0,
        });
        xs.push(v1.x);
        ys.push(v1.y);
      }
      if (v2) {
        datasets.push({
          label: "V2",
          data: [
            { x: 0, y: 0 },
            { x: v2.x, y: v2.y },
          ],
          drawArrow: true,
          arrowColor: "green",
          borderColor: "green",
          borderWidth: 2,
          pointRadius: 0,
        });
        xs.push(v2.x);
        ys.push(v2.y);
      }
      if (v1 && v2) {
        const rx = v1.x + (mode2 === "subtract-vectors" ? -v2.x : v2.x);
        const ry = v1.y + (mode2 === "subtract-vectors" ? -v2.y : v2.y);
        datasets.push({
          label: "R",
          data: [
            { x: 0, y: 0 },
            { x: rx, y: ry },
          ],
          drawArrow: true,
          arrowColor: "red",
          borderColor: "red",
          borderWidth: 2,
          pointRadius: 0,
        });
        xs.push(rx);
        ys.push(ry);
      }
    }

    if (mode2 === "scalar-multiplication") {
      const v = vecToXY(vectors[0] || {});
      if (v) {
        datasets.push({
          label: "V",
          data: [
            { x: 0, y: 0 },
            { x: v.x, y: v.y },
          ],
          drawArrow: true,
          arrowColor: "blue",
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 0,
        });
        const s = parseFloat(scalar);
        const rx = s * v.x;
        const ry = s * v.y;
        datasets.push({
          label: "s·V",
          data: [
            { x: 0, y: 0 },
            { x: rx, y: ry },
          ],
          drawArrow: true,
          arrowColor: "red",
          borderColor: "red",
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [6, 4],
        });
        xs.push(v.x, rx);
        ys.push(v.y, ry);
      }
    }

    if (mode2 === "angle-between") {
      const v1 = vecToXY(vectors[0] || {});
      const v2 = vecToXY(vectors[1] || {});
      if (v1) {
        datasets.push({
          label: "A",
          data: [
            { x: 0, y: 0 },
            { x: v1.x, y: v1.y },
          ],
          drawArrow: true,
          arrowColor: "blue",
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 0,
        });
        xs.push(v1.x);
        ys.push(v1.y);
      }
      if (v2) {
        datasets.push({
          label: "B",
          data: [
            { x: 0, y: 0 },
            { x: v2.x, y: v2.y },
          ],
          drawArrow: true,
          arrowColor: "green",
          borderColor: "green",
          borderWidth: 2,
          pointRadius: 0,
        });
        xs.push(v2.x);
        ys.push(v2.y);
      }
    }

    if (mode2 === "unit-vector") {
      const v = vecToXY(vectors[0] || {});
      if (v) {
        datasets.push({
          label: "V",
          data: [
            { x: 0, y: 0 },
            { x: v.x, y: v.y },
          ],
          drawArrow: true,
          arrowColor: "blue",
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 0,
        });
        const magv = Math.hypot(v.x, v.y);
        const ux = v.x / magv;
        const uy = v.y / magv;
        datasets.push({
          label: "û",
          data: [
            { x: 0, y: 0 },
            { x: ux, y: uy },
          ],
          drawArrow: true,
          arrowColor: "red",
          borderColor: "red",
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [6, 4],
        });
        xs.push(v.x, ux);
        ys.push(v.y, uy);
      }
    }

    const xmin = Math.min(...xs) - 1;
    const xmax = Math.max(...xs) + 1;
    const ymin = Math.min(...ys) - 1;
    const ymax = Math.max(...ys) + 1;

    const options = {
      animation: { duration: 0 },
      scales: {
        x: {
          type: "linear" as const,
          min: xmin,
          max: xmax,
          grid: { color: "rgba(200,200,200,0.2)" },
        },
        y: {
          type: "linear" as const,
          min: ymin,
          max: ymax,
          grid: { color: "rgba(200,200,200,0.2)" },
        },
      },
      plugins: { legend: { display: true }, tooltip: { enabled: true } },
    };

    return { datasets, options, labels: [] };
  }, [mode2, mag, angleInput, xComp, yComp, vectors, scalar]);

  function handleCompute() {
    let resSteps: JSX.Element[] = [];
    if (mode2 === "polar-to-components")
      resSteps = polarToComponentsSteps(mag, angleInput).steps;
    else if (mode2 === "components-to-polar")
      resSteps = componentsToPolarSteps(xComp, yComp).steps;
    else if (mode2 === "sum-vectors") resSteps = sumVectorsSteps(vectors).steps;
    else if (mode2 === "subtract-vectors") {
      if (vectors.length < 2)
        resSteps = [
          <div key="error">Debe ingresar al menos dos vectores (v1 y v2).</div>,
        ];
      else {
        const negV2 = { ...vectors[1] };
        if (negV2.x) negV2.x = (parseFloat(negV2.x) * -1).toString();
        if (negV2.y) negV2.y = (parseFloat(negV2.y) * -1).toString();
        if (negV2.mag && negV2.angle)
          negV2.mag = (parseFloat(negV2.mag) * -1).toString();
        resSteps = sumVectorsSteps([vectors[0], negV2]).steps;
      }
    } else if (mode2 === "scalar-multiplication") {
      if (vectors.length < 1)
        resSteps = [
          <div key="error">
            Ingrese un vector para multiplicar por el escalar.
          </div>,
        ];
      else resSteps = scalarMultiplySteps(scalar, vectors[0]).steps;
    } else if (mode2 === "angle-between") {
      if (vectors.length < 2)
        resSteps = [
          <div key="error">
            Ingrese dos vectores para calcular el ángulo entre ellos.
          </div>,
        ];
      else resSteps = angleBetweenSteps(vectors[0], vectors[1]).steps;
    } else if (mode2 === "unit-vector") {
      if (vectors.length < 1)
        resSteps = [<div key="error">Ingrese un vector.</div>];
      else resSteps = unitVectorSteps(vectors[0]).steps;
    }
    setOutput(resSteps);
  }

  function VectorRow({ idx }: { idx: number }) {
    const v = vectors[idx] || {};
    function update(partial: Partial<typeof v>) {
      const copy = vectors.slice();
      copy[idx] = { ...(copy[idx] || {}), ...partial };
      setVectors(copy);
    }
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-1 border rounded-md">
        <div className="flex flex-wrap items-center justify-around gap-2">
          <div>
            <label className="block text-sm"> Magnitud</label>
            <input
              value={v.mag || ""}
              onChange={(e) => update({ mag: e.target.value })}
              className="w-20 p-2 border rounded"
              placeholder="ej. 10"
            />
          </div>
          <div>
            <label className="block text-sm">Angulo</label>
            <input
              value={v.angle || ""}
              onChange={(e) => update({ angle: e.target.value })}
              className="w-28 p-2 border rounded"
              placeholder='ej.30 o "N 60 O"'
            />
          </div>
        </div>
        <div className="flex flex-col  items-center justify-center gap-1">
          <h1 className="text-xs">O por componentes:</h1>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex flex-col items-center justify-center">
              <label className=" text-xs"> x</label>
              <input
                value={v.x || ""}
                onChange={(e) => update({ x: e.target.value })}
                className="w-20 p-2 border rounded"
                placeholder="x"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              {" "}
              <label className=" text-xs"> y</label>
              <input
                value={v.y || ""}
                onChange={(e) => update({ y: e.target.value })}
                className="w-20 p-2 border rounded"
                placeholder="y"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        //TODO: VECTORES
        mode2,
        setMode2,
        mag,
        setMag,
        angleInput,
        setAngleInput,
        xComp,
        setXComp,
        yComp,
        setYComp,
        vectors,
        setVectors,
        VectorRow,
        scalar,
        setScalar,
        handleCompute,
        setOutput,
        output,
        chartDataAndOptions,
      }}
    >
      {children}
    </AlgebraContext.Provider>
  );
};

export { AlgebraProvider };
export default AlgebraContext;
