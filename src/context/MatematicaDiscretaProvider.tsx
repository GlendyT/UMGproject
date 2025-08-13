"use client";
import React, { useMemo, useState } from "react";

import {
  BinTerm,
  DivRow,
  GateType,
  MatematicaDiscretaContextType,
  Mode,
  ProviderProps,
} from "@/types";
import { createContext } from "react";

const MatematicaDiscretaContext = createContext<MatematicaDiscretaContextType>(
  null!
);

const MatematicaDiscretaProvider = ({ children }: ProviderProps) => {
  const isBinary = (s: string) => /^[01]+$/.test(s);
  const isDecimal = (s: string) => /^\d+$/.test(s);

  function binaryToDecimalSteps(binary: string): {
    terms: BinTerm[];
    total: bigint;
  } {
    const terms: BinTerm[] = [];
    const L = binary.length;
    let total = 0n;
    for (let i = 0; i < L; i++) {
      const ch = binary[i];
      const bit = (ch === "1" ? 1 : 0) as 0 | 1;
      const exp = L - 1 - i;
      const power = 2n ** BigInt(exp);
      const product = BigInt(bit) * power;
      total += product;
      terms.push({ bit, exp, power, product });
    }
    return { terms, total };
  }

  function decimalToBinarySteps(decimal: string): {
    rows: DivRow[];
    binary: string;
  } {
    let n = BigInt(decimal);
    if (n === 0n) {
      // Por convención: 0 en decimal es 0 en binario, sin divisiones.
      return {
        rows: [{ dividend: 0n, quotient: 0n, remainder: 0n }],
        binary: "0",
      };
    }
    const rows: DivRow[] = [];
    while (n > 0n) {
      const quotient = n / 2n;
      const remainder = (n % 2n) as 0n | 1n;
      rows.push({ dividend: n, quotient, remainder });
      n = quotient;
    }
    const binary = rows
      .map((r) => r.remainder.toString())
      .reverse()
      .join("");
    return { rows, binary };
  }

  const [mode, setMode] = useState<Mode>("bin2dec");
  const [binInput, setBinInput] = useState<string>("");
  const [decInput, setDecInput] = useState<string>("");

  const binValid = useMemo(
    () => (binInput.length > 0 ? isBinary(binInput) : false),
    [binInput]
  );
  const decValid = useMemo(
    () => (decInput.length > 0 ? isDecimal(decInput) : false),
    [decInput]
  );

  const binResult = useMemo(
    () => (binValid ? binaryToDecimalSteps(binInput) : null),
    [binInput, binValid]
  );
  const decResult = useMemo(
    () => (decValid ? decimalToBinarySteps(decInput) : null),
    [decInput, decValid]
  );

  //TODO: CONVERSOR DE COMPUERTAS LOGICAS

  const gatesLogic: Record<GateType, (a: number, b?: number) => number> = {
    AND: (a, b) => ((a ?? 0) && (b ?? 0) ? 1 : 0),
    OR: (a, b) => ((a ?? 0) || (b ?? 0) ? 1 : 0),
    NOT: (a) => (a ?? 0 ? 0 : 1),
    XOR: (a, b) => ((a ?? 0) ^ (b ?? 0) ? 1 : 0),
    NAND: (a, b) => ((a ?? 0) && (b ?? 0) ? 0 : 1),
    NOR: (a, b) => ((a ?? 0) || (b ?? 0) ? 0 : 1),
    XNOR: (a, b) => ((a ?? 0) ^ (b ?? 0) ? 0 : 1),
  };

  // Evalúa expresiones booleanas escritas como texto (soporta !, ¬, +, *, paréntesis)
  function evaluateExpression(
    expr: string,
    vars: Record<string, number>
  ): number {
    let jsExpr = expr
      .replace(/¬/g, "!")
      .replace(/·/g, "&&")
      .replace(/\*/g, "&&")
      .replace(/\+/g, "||");

    for (const v in vars) {
      jsExpr = jsExpr.replace(
        new RegExp(`\\b${v}\\b`, "g"),
        vars[v] ? "true" : "false"
      );
    }

    try {
      return eval(jsExpr) ? 1 : 0;
    } catch {
      return 0;
    }
  }

  function getVariablesFromExpression(expr: string): string[] {
    const matches = expr.match(/[A-Z]/g) || [];
    return Array.from(new Set(matches));
  }

  function generateTruthTableFromExpression(expr: string) {
    const vars = getVariablesFromExpression(expr);
    type TruthTableRow = Record<string, number> & { X: number };
    const table: TruthTableRow[] = [];
    const rows = Math.pow(2, vars.length);
    for (let i = 0; i < rows; i++) {
      const vals: Record<string, number> = {};
      vars.forEach((v, idx) => {
        vals[v] = (i >> (vars.length - idx - 1)) & 1;
      });
      const X = evaluateExpression(expr, vals);
      table.push({ ...vals, X });
    }
    return { vars, table };
  }

  const GateSymbol: React.FC<{ gate: GateType; a: number; b?: number }> = ({
    gate,
  }) => {
    const w = 200;
    const h = 110;
    const padding = 16;
    const midY = h / 2;
    const OutputBubble: React.FC = () => (
      <circle
        cx={w - padding + 8}
        cy={midY}
        r={6}
        fill="white"
        stroke="#111"
        strokeWidth={2}
      />
    );
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {gate !== "NOT" ? (
          <>
            <line
              x1={padding}
              y1={h * 0.35}
              x2={w * 0.32}
              y2={h * 0.35}
              stroke="#111"
              strokeWidth={3}
            />
            <circle cx={padding} cy={h * 0.35} r={3} fill="#111" />
            <line
              x1={padding}
              y1={h * 0.65}
              x2={w * 0.32}
              y2={h * 0.65}
              stroke="#111"
              strokeWidth={3}
            />
            <circle cx={padding} cy={h * 0.65} r={3} fill="#111" />
          </>
        ) : (
          <>
            <line
              x1={padding}
              y1={midY}
              x2={w * 0.32}
              y2={midY}
              stroke="#111"
              strokeWidth={3}
            />
            <circle cx={padding} cy={midY} r={3} fill="#111" />
          </>
        )}
        {gate === "AND" || gate === "NAND" ? (
          <path
            d={`M ${w * 0.32} ${h * 0.22} H ${w * 0.58} A ${h * 0.28} ${
              h * 0.28
            } 0 0 1 ${w * 0.58} ${h * 0.78} H ${w * 0.32} Z`}
            fill="#f7e0a3"
            stroke="#111"
            strokeWidth={3}
          />
        ) : null}
        {gate === "OR" ||
        gate === "NOR" ||
        gate === "XOR" ||
        gate === "XNOR" ? (
          <>
            {(gate === "XOR" || gate === "XNOR") && (
              <path
                d={`M ${w * 0.3} ${h * 0.2} C ${w * 0.18} ${h * 0.5}, ${
                  w * 0.18
                } ${h * 0.5}, ${w * 0.3} ${h * 0.8}`}
                fill="none"
                stroke="#111"
                strokeWidth={3}
              />
            )}
            <path
              d={`M ${w * 0.34} ${h * 0.2} C ${w * 0.2} ${h * 0.5}, ${
                w * 0.2
              } ${h * 0.5}, ${w * 0.34} ${h * 0.8} C ${w * 0.54} ${h * 0.92}, ${
                w * 0.68
              } ${h * 0.7}, ${w * 0.7} ${h * 0.5} C ${w * 0.68} ${h * 0.3}, ${
                w * 0.54
              } ${h * 0.08}, ${w * 0.34} ${h * 0.2} Z`}
              fill="#d9ecff"
              stroke="#111"
              strokeWidth={3}
            />
          </>
        ) : null}
        {gate === "NOT" ? (
          <path
            d={`M ${w * 0.32} ${h * 0.2} L ${w * 0.32} ${h * 0.8} L ${
              w * 0.7
            } ${h * 0.5} Z`}
            fill="#e8d7ff"
            stroke="#111"
            strokeWidth={3}
          />
        ) : null}
        <line
          x1={w * 0.7}
          y1={midY}
          x2={w - padding}
          y2={midY}
          stroke="#111"
          strokeWidth={3}
        />
        {(gate === "NAND" ||
          gate === "NOR" ||
          gate === "XNOR" ||
          gate === "NOT") && <OutputBubble />}
        <text x={w / 2} y={h - 6} textAnchor="middle" fontSize={14} fill="#111">
          {gate}
        </text>
      </svg>
    );
  };

    const [gate, setGate] = useState<GateType>("AND");
  const [expr, setExpr] = useState("¬A·B·C·¬(A + D)");
  const { vars, table } = useMemo(
    () => generateTruthTableFromExpression(expr),
    [expr]
  );

  return (
    <MatematicaDiscretaContext.Provider
      value={{
        setMode,
        mode,
        binInput,
        setBinInput,
        binValid,
        binResult,
        decInput,
        setDecInput,
        decValid,
        decResult,
        isBinary,
        isDecimal,
        binaryToDecimalSteps,
        decimalToBinarySteps,
        gatesLogic,
        evaluateExpression,
        getVariablesFromExpression,
        generateTruthTableFromExpression,
        GateSymbol,
        gate,
        setGate,
        expr,
        setExpr,
        vars,
        table,
      }}
    >
      {children}
    </MatematicaDiscretaContext.Provider>
  );
};

export { MatematicaDiscretaProvider };
export default MatematicaDiscretaContext;
