"use client";
import React, { useState } from "react";
import Fraction from "fraction.js";

type FractionMatrix = Fraction[][];

const GaussianEliminationFractions: React.FC = () => {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(4).fill("0"))
  );
  const [steps, setSteps] = useState<string[]>([]);
  const [solution, setSolution] = useState<Fraction[] | null>(null);

  const handleChange = (row: number, col: number, value: string) => {
    const newMatrix = matrix.map(r => [...r]);
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  const handleSizeChange = (n: number) => {
    setSize(n);
    setMatrix(Array.from({ length: n }, () => Array(n + 1).fill("0")));
  };

  const solve = () => {
    const m: FractionMatrix = matrix.map(row =>
      row.map(v => new Fraction(v))
    );

    const n = size;
    const stepLog: string[] = [];

    stepLog.push("Matriz inicial:");
    stepLog.push(printMatrix(m));

    // Eliminación hacia adelante (Método de Gauss, sin normalizar pivotes)
    for (let k = 0; k < n - 1; k++) {
      for (let i = k + 1; i < n; i++) {
        // Multiplicamos filas para evitar fracciones durante eliminación
        const factorA = m[k][k];
        const factorB = m[i][k];
        const newRow = m[i].map((_, j) =>
          factorA.mul(m[i][j]).sub(factorB.mul(m[k][j]))
        );
        m[i] = newRow;
        stepLog.push(
          `Eliminando en fila ${i + 1}: R${i + 1} = (${factorA})·R${i + 1} - (${factorB})·R${k + 1}`
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
      
      // Verificar si el coeficiente es cero para evitar división por cero
      if (m[i][i].equals(0)) {
        stepLog.push(`Error: Coeficiente en posición (${i+1},${i+1}) es cero. La matriz puede ser singular o el sistema no tiene solución única.`);
        setSolution(null);
        setSteps(stepLog);
        return;
      }
      
      x[i] = m[i][n].sub(sum).div(m[i][i]);
      stepLog.push(
        `De la ecuación ${i + 1}: ${formatNumber(m[i][i])}·x${i + 1} + ... = ${
          formatNumber(m[i][n])
        } → x${i + 1} = ${formatNumber(x[i])}`
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
      .map(row =>
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
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h2>Método de Gauss con Fracciones (Dinámico)</h2>

      <label>
        Tamaño:
        <input
          type="number"
          min={2}
          max={6}
          value={size}
          onChange={e => handleSizeChange(Number(e.target.value))}
          style={{ width: "50px", marginLeft: "5px" }}
        />
      </label>

      <h3>Ingrese la matriz aumentada:</h3>
      <table border={1} cellPadding={5} style={{ borderCollapse: "collapse" }}>
        <tbody>
          {matrix.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((val, cIdx) => (
                <td key={cIdx}>
                  <input
                    type="text"
                    value={val}
                    onChange={e =>
                      handleChange(rIdx, cIdx, e.target.value)
                    }
                    style={{ width: "60px" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={solve}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          cursor: "pointer"
        }}
      >
        Resolver
      </button>

      {steps.length > 0 && (
        <>
          <h3>Pasos:</h3>
          <pre
            style={{
              background: "#f0f0f0",
              padding: "10px",
              whiteSpace: "pre-wrap"
            }}
          >
            {steps.join("\n\n")}
          </pre>
        </>
      )}

      {solution && (
        <>
          <h3>Solución:</h3>
          <p>
            {solution.map((val, i) => (
              <span key={i}>
                {`x${i + 1} = ${formatNumber(val)}`}
                {i < solution.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </>
      )}
    </div>
  );
};

export default GaussianEliminationFractions;
