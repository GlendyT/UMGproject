"use client";

import { AlgoritmoContextType, AlgoritmosProps, FractionMatrix } from "@/types";
import Fraction from "fraction.js";
import { createContext, useState } from "react";

const AlgoritmosContext = createContext<AlgoritmoContextType>(null!);

const AlgoritmosProvider = ({ children }: AlgoritmosProps) => {
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
      // 🔹 Si el pivote es cero, intercambiar filas
      if (m[k][k].equals(0)) {
        let swapRow = -1;
        for (let r = k + 1; r < n; r++) {
          if (!m[r][k].equals(0)) {
            swapRow = r;
            break;
          }
        }
        if (swapRow === -1) {
          stepLog.push(
            `Error: pivote en columna ${
              k + 1
            } es cero y no se encontró fila para intercambiar.`
          );
          setSteps(stepLog);
          return;
        }
        [m[k], m[swapRow]] = [m[swapRow], m[k]];
        stepLog.push(`Intercambiando fila ${k + 1} con fila ${swapRow + 1}`);
        stepLog.push(printMatrix(m));
      }

      // 🔹 Eliminación hacia abajo
      for (let i = k + 1; i < n; i++) {
        if (m[i][k].equals(0)) continue; // Nada que eliminar
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

    // Sustitución hacia atrás
    const x: Fraction[] = Array(n).fill(new Fraction(0));
    for (let i = n - 1; i >= 0; i--) {
      let sum = new Fraction(0);
      for (let j = i + 1; j < n; j++) {
        sum = sum.add(m[i][j].mul(x[j]));
      }

      if (m[i][i].equals(0)) {
        stepLog.push(
          `Error: coeficiente en posición (${i + 1},${
            i + 1
          }) es cero. Sistema sin solución única.`
        );
        setSolution(null);
        setSteps(stepLog);
        return;
      }

      x[i] = m[i][n].sub(sum).div(m[i][i]);
      stepLog.push(
        `De la ecuación ${i + 1}: x${i + 1} = ${formatNumber(x[i])}`
      );
    }

    setSolution(x);
    setSteps(stepLog);
  };

  const formatNumber = (val: Fraction) => {
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
  return (
    <AlgoritmosContext.Provider
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
      }}
    >
      {children}
    </AlgoritmosContext.Provider>
  );
};

export { AlgoritmosProvider };
export default AlgoritmosContext;
