"use client";
import useAlgebra from "@/hooks/useAlgebra";
import { MinorStep } from "@/types/index";
import TitleCourse from "@/components/TitleCourse";

export default function Laplace3x3() {
  const {
    mode,
    index,
    size4,
    matrix4,
    handleChange4,
    signMatrix,
    setMode,
    setIndex,
    handleSizeChange4,
    steps2,
    det2,
  } = useAlgebra();

  return (
    <div className="min-h-screen flex flex-col gap-2 items-center w-full p-4 bg-gray-100">
      <TitleCourse course="Determinante por LAPLACE" />
      <div className="flex flex-wrap items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-between h-full  p-2 shadow-xl rounded-2xl ">
          <h2 className="text-xl text-center font-bold ">
            {mode === "col" ? "columna" : "fila"} {index + 1}
          </h2>

          <div
            className={`grid ${
              size4 === 3 ? "grid-cols-3" : "grid-cols-4"
            } gap-2 mb-4`}
          >
            {matrix4.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  value={val}
                  onChange={(e) => handleChange4(e, i, j)}
                  className="border p-2 w-16 text-center"
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between h-full p-2 shadow-xl rounded-2xl">
          <h3 className="text-lg font-semibold">Matriz de signos:</h3>
          <div
            className={`grid ${
              size4 === 3 ? "grid-cols-3" : "grid-cols-4"
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

        <div className="flex flex-col items-center justify-center gap-6 ">
          <div className=" flex items-center gap-4  shadow-xl rounded-xl p-2">
            <label className="font-semibold">Expandir por:</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setIndex(0);
              }}
              className="border p-2 rounded-md"
            >
              <option value="col">Columna</option>
              <option value="row">Fila</option>
            </select>

            <label className="font-semibold">Número:</label>
            <select
              value={index}
              onChange={(e) => setIndex(parseInt(e.target.value))}
              className="border p-2 rounded-md"
            >
              {Array(size4)
                .fill(0)
                .map((_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}
            </select>
          </div>
          <div className=" shadow-xl rounded-xl  p-2">
            <label className="font-semibold mr-2">Tamaño:</label>
            <select
              value={size4}
              onChange={(e) => handleSizeChange4(parseInt(e.target.value))}
              className="border rounded-md p-2"
            >
              <option value={3}>3x3</option>
              <option value={4}>4x4</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-8 ">
        <div className="w-full">
          <h3 className="text-lg text-center font-extrabold">
            Expansión paso a paso:
          </h3>
          <div className="flex flex-wrap items-center justify-center w-full  gap-2">
            {steps2.map((s, idx) => (
              <div
                key={idx}
                className={` p-4 flex rounded bg-gray-100 shadow-xl  ${
                  s.minor.length === 2 ? "flex-row " : "flex-col"
                }`}
              >
                <div className="flex justify-center items-center gap-2  ">
                  <span>
                    {s.sign > 0 ? "+" : "-"}({s.element})
                  </span>
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
                    <div className="flex flex-col gap-2 p-2 items-center justify-center">
                      <div className="font-semibold">
                        Cálculo del determinante 3x3:
                      </div>
                      {Array.isArray(s.minorSteps) &&
                        s.minorSteps.map((step: MinorStep, stepIdx: number) => (
                          <div
                            key={stepIdx}
                            className=" rounded flex flex-col w-full gap-2 border p-2"
                          >
                            <div className="flex  gap-2 items-center justify-center   ">
                              <span>
                                {step.sign > 0 ? "+" : "-"} ({step.element}){" "}
                              </span>{" "}
                              <span>·</span>
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
                                      className="w-8 h-8 flex items-center justify-center text-sm "
                                    >
                                      {val}
                                    </span>
                                  ))
                                )}
                              </span>
                            </div>
                            <div className="text-xs mt-1 ">
                              = {step.sign > 0 ? "+" : "-"} ({step.element}) × (
                              {step.minorSteps}
                            </div>
                            <div className="text-xs mt-1 ">
                              = {step.sign > 0 ? "+" : "-"} ({step.element}) × (
                              {step.minorValue}) ={" "}
                              <span className="text-blue-600 font-extrabold">
                                {step.term}
                              </span>
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
                    </div>
                  ) : (
                    <div>Determinante 3x3 = {s.minorValue}</div>
                  )}
                  <div className=" font-semibold text-green-600 text-center">
                    Resultado: {s.sign > 0 ? "+" : "-"} ({s.element}) × (
                    {s.minorValue}) = {s.term}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-auto flex flex-col items-center justify-center mt-4 p-2 shadow-2xl rounded-xl ">
          {size4 === 4 ? (
            <>
              <h3 className="text-lg font-extrabold">
                Cálculo final del determinante 4x4:
              </h3>
              <div className="text-sm flex items-center flex-col gap-2">
                <div className="">
                  {" "}
                  {steps2
                    .map((s) => s.term)
                    .join(" + ")
                    .replace(/\+ -/g, " - ")}
                </div>
                <div className="font-bold text-lg">Determinante = {det2}</div>
              </div>
            </>
          ) : (
            <h2 className="text-xl font-bold ">Determinante = {det2}</h2>
          )}
        </div>
      </div>
    </div>
  );
}
