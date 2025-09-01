"use client";
import React, { useState } from "react";
import BotonBack from "../../../utils/BotonBack";

type MinorStep = {
  element: number;
  sign: number;
  minor: number[][];
  minorValue: number;
  minorSteps: string;
  term: number;
};

type StepData = {
  element: number;
  sign: number;
  minor: number[][];
  minorValue: number;
  term: number;
  minorSteps: string | MinorStep[] | null;
};

export default function Laplace3x3() {
  const [size, setSize] = useState(3);
  const [matrix, setMatrix] = useState([
    [-3, 4, 2],
    [2, -1, -3],
    [4, -6, 5],
  ]);

  const [mode, setMode] = useState("col");
  const [index, setIndex] = useState(2);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseInt(e.target.value);
    setMatrix(newMatrix);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setIndex(0);
    const newMatrix = Array(newSize)
      .fill(0)
      .map(() => Array(newSize).fill(0));
    setMatrix(newMatrix);
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
    let det = 0;
    const steps: StepData[] = [];

    if (mode === "col") {
      for (let i = 0; i < size; i++) {
        const sign = (i + index) % 2 === 0 ? 1 : -1;
        const element = matrix[i][index];

        const minor = matrix
          .filter((_, r) => r !== i)
          .map((row) => row.filter((_, c) => c !== index));

        const minorResult =
          size === 4 && minor.length === 3
            ? calculateDet(minor, true)
            : calculateDet(minor);
        const minorValue =
          typeof minorResult === "object" ? minorResult.value : minorResult;
        const term = sign * element * minorValue;

        steps.push({
          element,
          sign,
          minor,
          minorValue: typeof minorValue === "number" ? minorValue : 0,
          term,
          minorSteps:
            typeof minorResult === "object" ? minorResult.steps : null,
        });
        det += term;
      }
    } else {
      for (let j = 0; j < size; j++) {
        const sign = (index + j) % 2 === 0 ? 1 : -1;
        const element = matrix[index][j];

        const minor = matrix
          .filter((_, r) => r !== index)
          .map((row) => row.filter((_, c) => c !== j));

        const minorResult =
          size === 4 && minor.length === 3
            ? calculateDet(minor, true)
            : calculateDet(minor);
        const minorValue =
          typeof minorResult === "object" ? minorResult.value : minorResult;
        const term = sign * element * minorValue;

        steps.push({
          element,
          sign,
          minor,
          minorValue: typeof minorValue === "number" ? minorValue : 0,
          term,
          minorSteps:
            typeof minorResult === "object" ? minorResult.steps : null,
        });
        det += term;
      }
    }

    return { det, steps };
  };

  const { det, steps } = laplaceDet();

  const signMatrix = Array(size)
    .fill(0)
    .map((_, i) =>
      Array(size)
        .fill(0)
        .map((_, j) => ((i + j) % 2 === 0 ? "+" : "-"))
    );

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center w-full  px-4 mb-2">
      <div className="flex flex-row w-full">
        <BotonBack />
        <div className="flex w-full items-center justify-center">
          <h2 className="text-xl text-center font-bold mb-2">
            Determinante por Laplace <br />
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-10">
        <div className="flex flex-col bg-gray-100 p-2 ">
          <h2 className="text-xl text-center font-bold ">
            ({mode === "col" ? "columna" : "fila"} {index + 1})
          </h2>

          <div
            className={`grid ${
              size === 3 ? "grid-cols-3" : "grid-cols-4"
            } gap-2 mb-4`}
          >
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
        </div>

        <div className="flex flex-col items-center justify-between h-full bg-gray-200 px-2">
          <h3 className="text-lg font-semibold mb-2">Matriz de signos:</h3>
          <div
            className={`grid ${
              size === 3 ? "grid-cols-3" : "grid-cols-4"
            } gap-2 mb-6`}
          >
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
        </div>

        <div className="flex flex-col items-center justify-center gap-6">
          <div className="mb-4 flex items-center gap-4 bg-gray-100 p-2">
            <label className="font-semibold">Expandir por:</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setIndex(0);
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
              {Array(size)
                .fill(0)
                .map((_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4 bg-gray-200 p-2">
            <label className="font-semibold mr-2">Tamaño:</label>
            <select
              value={size}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              className="border p-2"
            >
              <option value={3}>3x3</option>
              <option value={4}>4x4</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-8 ">
        <div className="w-full">
          <h3 className="text-lg text-center font-semibold">
            Expansión paso a paso:
          </h3>
          <div className="flex flex-wrap items-center justify-center w-full gap-2">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`border p-4 flex rounded bg-gray-100 ${
                  s.minor.length === 2 ? "flex-row " : "flex-col"
                }`}
              >
                <div className="flex items-center gap-2 mb-3 ">
                  <span className="font-semibold">
                    {s.sign > 0 ? "+" : "-"}
                  </span>
                  <span>({s.element})</span>
                  <span>·</span>
                  <div
                    className={`inline-grid ${
                      s.minor.length === 2 ? "grid-cols-2" : "grid-cols-3"
                    } gap-1 border-l-2 border-r-2 p-1`}
                  >
                    {s.minor.map((row, i) =>
                      row.map((val, j) => (
                        <div
                          key={`${i}-${j}`}
                          className="w-8 h-8 flex items-center justify-center text-sm"
                        >
                          {val}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-700 ml-4">
                  {s.minor.length === 2 ? (
                    <>
                      <div>Cálculo del determinante 2x2:</div>
                      <div className="mt-1">
                        = ({s.minor[0][0]}) × ({s.minor[1][1]}) - (
                        {s.minor[0][1]}) × ({s.minor[1][0]})
                      </div>
                      <div className="mt-1">
                        = {s.minor[0][0] * s.minor[1][1]} -{" "}
                        {s.minor[0][1] * s.minor[1][0]}
                      </div>
                      <div className="mt-1">= {s.minorValue}</div>
                    </>
                  ) : s.minor.length === 3 && s.minorSteps ? (
                    <>
                      <div className="font-semibold">
                        Cálculo del determinante 3x3:
                      </div>
                      {Array.isArray(s.minorSteps) &&
                        s.minorSteps.map((step: MinorStep, stepIdx: number) => (
                          <div
                            key={stepIdx}
                            className="mt-2 p-2 bg-gray-100 rounded"
                          >
                            <div className="text-xs bg-green-700">
                              <span>{step.sign > 0 ? "+" : "-"}</span>
                              <span> ({step.element}) </span> <span>·</span>
                              <span
                                className={`inline-grid ${
                                  s.minor.length === 2
                                    ? "grid-cols-2"
                                    : "grid-cols-2"
                                } gap-1 border-l-2 border-r-2 p-1`}
                              >
                                {step.minor.map((row: number[], i: number) =>
                                  row.map((val: number, j: number) => (
                                    <span
                                      key={`${i}-${j}`}
                                      className="w-8 h-8 flex items-center justify-center text-sm"
                                    >
                                      {val}
                                    </span>
                                  ))
                                )}
                              </span>
                            </div>
                            <div className="text-xs mt-1">
                              = {step.sign > 0 ? "+" : "-"} ({step.element}) × (
                              {step.minorSteps})
                            </div>
                            <div className="text-xs mt-1">
                              = {step.sign > 0 ? "+" : "-"} ({step.element}) × (
                              {step.minorValue}) = {step.term}
                            </div>
                          </div>
                        ))}
                      <div className="mt-2 font-semibold text-blue-600">
                        Suma total 3x3:{" "}
                        {Array.isArray(s.minorSteps)
                          ? s.minorSteps
                              .map((step: MinorStep) => step.term)
                              .join(" + ")
                              .replace(/\+ -/g, " - ")
                          : ""}{" "}
                        = {s.minorValue}
                      </div>
                    </>
                  ) : (
                    <div>Determinante 3x3 = {s.minorValue}</div>
                  )}
                  <div className="mt-2 font-semibold text-green-600">
                    Resultado: {s.sign > 0 ? "+" : "-"} ({s.element}) × (
                    {s.minorValue}) = {s.term}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {size === 4 && (
          <div className="w-full mt-6 p-4 bg-blue-50 rounded">
            <h3 className="text-lg font-semibold mb-3">
              Cálculo final del determinante 4x4:
            </h3>
            <div className="text-sm">
              <div className="mb-2">
                Det ={" "}
                {steps
                  .map(
                    (s, idx) =>
                      `${s.sign > 0 && idx > 0 ? "+" : ""}${
                        s.sign < 0 ? "-" : ""
                      }(${s.element}) × (${s.minorValue})`
                  )
                  .join(" ")}
              </div>
              <div className="mb-2">
                ={" "}
                {steps
                  .map((s) => s.term)
                  .join(" + ")
                  .replace(/\+ -/g, " - ")}
              </div>
              <div className="font-bold text-lg">= {det}</div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mt-4">Determinante = {det}</h2>
      </div>
    </div>
  );
}
