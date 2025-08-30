"use client";
import React, { useState } from "react";

export default function Laplace3x3() {
  const [matrix, setMatrix] = useState([
    [-3, 4, 2],
    [2, -1, -3],
    [4, -6, 5],
  ]);

  const [mode, setMode] = useState("col"); // "col" o "row"
  const [index, setIndex] = useState(2); // por defecto columna 3 o fila 3 (índice 2)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseInt(e.target.value);
    setMatrix(newMatrix);
  };

  const minorDet = (m: number[][]) => {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  };

  const laplaceDet = () => {
    let det = 0;
    const steps = [];

    if (mode === "col") {
      // Expansión por columna
      for (let i = 0; i < 3; i++) {
        const sign = ((i + index) % 2 === 0 ? 1 : -1);
        const element = matrix[i][index];

        const minor = matrix
          .filter((_, r) => r !== i)
          .map((row) => row.filter((_, c) => c !== index));

        const minorValue = minorDet(minor);
        const term = sign * element * minorValue;

        steps.push({ element, sign, minor, minorValue, term });
        det += term;
      }
    } else {
      // Expansión por fila
      for (let j = 0; j < 3; j++) {
        const sign = ((index + j) % 2 === 0 ? 1 : -1);
        const element = matrix[index][j];

        const minor = matrix
          .filter((_, r) => r !== index)
          .map((row) => row.filter((_, c) => c !== j));

        const minorValue = minorDet(minor);
        const term = sign * element * minorValue;

        steps.push({ element, sign, minor, minorValue, term });
        det += term;
      }
    }

    return { det, steps };
  };

  const { det, steps } = laplaceDet();

  // Matriz de signos fija
  const signMatrix = [
    ["+", "-", "+"],
    ["-", "+", "-"],
    ["+", "-", "+"],
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        Determinante por Laplace ({mode === "col" ? "columna" : "fila"} {index + 1})
      </h2>

      {/* Matriz con inputs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={val}
              onChange={(e) => handleChange(e, i, j)}
              className="border p-2 w-16 text-center"
            />
          ))
        )}
      </div>

      {/* Selector de modo (fila o columna) */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Expandir por:</label>
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setIndex(0); // reiniciar índice
          }}
          className="border p-2"
        >
          <option value="col">Columna</option>
          <option value="row">Fila</option>
        </select>

        <label className="font-semibold">Número:</label>
        <select
          value={index}
          onChange={(e) => setIndex(parseInt(e.target.value))}
          className="border p-2"
        >
          <option value={0}>1</option>
          <option value={1}>2</option>
          <option value={2}>3</option>
        </select>
      </div>

      {/* Matriz de signos */}
      <h3 className="text-lg font-semibold mb-2">Matriz de signos:</h3>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {signMatrix.map((row, i) =>
          row.map((val, j) => (
            <div
              key={`${i}-${j}`}
              className="border p-2 w-16 text-center font-bold"
            >
              {val}
            </div>
          ))
        )}
      </div>

      {/* Expansión paso a paso */}
      <h3 className="text-lg font-semibold">Expansión paso a paso:</h3>
      <ul className="list-disc ml-6">
        {steps.map((s, idx) => (
          <li key={idx} className="mb-2">
            {s.sign > 0 ? "+" : "-"} ({s.element}) · |{" "}
            {s.minor[0][0]} {s.minor[0][1]} ; {s.minor[1][0]} {s.minor[1][1]} | ={" "}
            {s.term}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-4">Determinante = {det}</h2>
    </div>
  );
}
