"use client";
import React, { useMemo, useState } from "react";
import { createContext } from "react";
import {
  BinTerm,
  DivRow,
  MatematicaDiscretaContextType,
  Mode,
  ProviderProps,
} from "../types";

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

  function normalizeExpr(input: string): string {
    return input
      .replace(/\s+/g, "")
      .replace(/[·×∧]/g, "*")
      .replace(/[∨,]/g, "+")
      .replace(/¬/g, "!")
      .toUpperCase();
  }

  function getVariables(expr: string): string[] {
    const matches = expr.match(/[A-Z]/g) || [];
    return Array.from(new Set(matches)).sort();
  }

  function splitTopLevelSum(expr: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      else if (ch === "+" && depth === 0) {
        parts.push(expr.slice(start, i));
        start = i + 1;
      }
    }
    parts.push(expr.slice(start));
    return parts.filter(Boolean);
  }

  function toJsBoolean(expr: string): string {
    return expr.replace(/\*/g, "&&").replace(/\+/g, "||");
  }

  function evalWithAssignment(
    jsExpr: string,
    vars: string[],
    asg: Record<string, number>
  ): number {
    let code = jsExpr;
    for (const v of vars) {
      code = code.replace(
        new RegExp(`\\b${v}\\b`, "g"),
        asg[v] ? "true" : "false"
      );
    }
    try {
      const res = Function(`"use strict"; return (${code});`)();
      return res ? 1 : 0;
    } catch {
      return 0;
    }
  }

  function generateTruthTableWithSteps(exprInput: string) {
    const expr = normalizeExpr(exprInput);
    const terms = splitTopLevelSum(expr);
    const vars = getVariables(expr);

    type Row = Record<string, number> & { [term: string]: number } & {
      X: number;
    };
    const table: Row[] = [];

    const rows = Math.pow(2, vars.length);
    for (let i = 0; i < rows; i++) {
      const asg: Record<string, number> = {};
      vars.forEach((v, idx) => {
        asg[v] = (i >> (vars.length - idx - 1)) & 1;
      });

      const termValues = terms.map((t) => {
        const jsT = toJsBoolean(t);
        return evalWithAssignment(jsT, vars, asg);
      });

      const jsExpr = toJsBoolean(expr);
      const X = evalWithAssignment(jsExpr, vars, asg);

      const row: Row = { ...asg, X };
      terms.forEach((t, idx) => (row[t] = termValues[idx]));

      table.push(row);
    }

    return {
      vars,
      exprToLatex: exprToLatex,
      terms,
      table
    };
  }

  // ===================== Conversión a LaTeX =====================

  function exprToLatex(expr: string): string {
    // 1) Sustituimos negaciones: !A -> \overrightarrow{A}
    let latex = expr.replace(/!([A-Z])/g, (_, v) => `\\overrightarrow{${v}}`);

    // 2) Multiplicaciones: * -> nada (juxtaposición)
    latex = latex.replace(/\*/g, "");

    // 3) Sumas: + -> +
    latex = latex.replace(/\+/g, " + ");

    return latex;
  }

    const [expr, setExpr] = useState<string>("");

  const { vars, terms, table } = useMemo(
    () => generateTruthTableWithSteps(expr),
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
        generateTruthTableWithSteps,
        exprToLatex,
        expr,
        setExpr,
        vars,
        terms,
        table
      }}
    >
      {children}
    </MatematicaDiscretaContext.Provider>
  );
};

export { MatematicaDiscretaProvider };
export default MatematicaDiscretaContext;
