"use client";
import "katex/dist/katex.min.css";
import { Scatter } from "react-chartjs-2";
import { Mode2 } from "@/types/index";
import useAlgebra from "@/hooks/useAlgebra";
import TitleCourse from "@/components/TitleCourse";
import BotonUtil from "@/utils/BotonUtil";
import { FaPlus, FaRegTrashCan } from "react-icons/fa6";
import VectorRow from "./VectorRow";

export default function VectorSolver() {
  const {
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
    scalar,
    setScalar,
    handleCompute,
    output,
    setOutput,
    chartDataAndOptions,
  } = useAlgebra();

  const chartData = {
    datasets: chartDataAndOptions.datasets,
    labels: chartDataAndOptions.labels,
  };
  const chartOptions = chartDataAndOptions.options;

  return (
    <div className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Vectores 2D" />
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white/5 p-4 rounded ">
          <select
            value={mode2}
            onChange={(e) => setMode2(e.target.value as Mode2)}
            className="p-2 border rounded w-full"
          >
            <option value="polar-to-components">Polar → Componentes</option>
            <option value="components-to-polar">Componentes → Polar</option>
            <option value="sum-vectors">Suma de vectores</option>
            <option value="subtract-vectors">Resta (v1 - v2)</option>
            <option value="scalar-multiplication">
              Multiplicación por escalar
            </option>
            <option value="angle-between">Ángulo entre dos vectores</option>
            <option value="unit-vector">Vector unitario</option>
          </select>
        </div>

        {mode2 === "polar-to-components" && (
          <div className="flex flex-row gap-2 ">
            <div className="w-20 flex items-center justify-center flex-col">
              <label className="text-xs">Magnitud |V|</label>
              <input
                className="w-full p-2 border rounded mb-2"
                value={mag}
                onChange={(e) => setMag(e.target.value)}
              />
            </div>
            <div className="w-40 flex items-center justify-center flex-col">
              <label className="text-xs">Ángulo ( ej. N 60 O)</label>
              <input
                className="w-full p-2 border rounded mb-2"
                value={angleInput}
                onChange={(e) => setAngleInput(e.target.value)}
              />
            </div>
          </div>
        )}

        {mode2 === "components-to-polar" && (
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col items-center justify-center w-32">
              <label className="text-xs">Componente Vx</label>
              <input
                className="w-full p-2 border rounded mb-2"
                value={xComp}
                onChange={(e) => setXComp(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center justify-center w-32">
              <label className="text-xs">Componente Vy</label>
              <input
                className="w-full p-2 border rounded mb-2"
                value={yComp}
                onChange={(e) => setYComp(e.target.value)}
              />
            </div>
          </div>
        )}

        {(mode2 === "sum-vectors" ||
          mode2 === "subtract-vectors" ||
          mode2 === "angle-between") && (
          <div className="flex flex-col items-center justify-center mx-auto w-full">
            <div className="flex flex-row items-center justify-center gap-2 ">
              {vectors.map((_, i) => (
                <div
                  key={i}
                  className="p-1  flex flex-col gap-2 items-center justify-center"
                >
                  <VectorRow idx={i} />

                  <BotonUtil
                    className="px-3 py-1 bg-red-600 rounded text-white"
                    onClick={() =>
                      setVectors(vectors.filter((_, j) => j !== i))
                    }
                    icon={<FaRegTrashCan />}
                  />
                </div>
              ))}
            </div>
            <BotonUtil
              className="px-3 py-2 bg-green-600 rounded text-white mb-2 "
              onClick={() =>
                setVectors([...vectors, { mag: "", angle: "", x: "", y: "" }])
              }
              icon={<FaPlus />}
            />
          </div>
        )}

        {mode2 === "scalar-multiplication" && (
          <div className="bg-white/5  rounded mb-4">
            <label className="block mb-2">Escalar</label>
            <input
              className="w-full p-2 border rounded mb-2"
              value={scalar}
              onChange={(e) => setScalar(e.target.value)}
            />
            <label className="text-xs mb-2"> (polar o componentes)</label>
            <VectorRow idx={0} />
          </div>
        )}

        {mode2 === "unit-vector" && (
          <div className="bg-white/5 p-4 rounded mb-4">
            <label className="block mb-2">Vector (polar o componentes)</label>
            <VectorRow idx={0} />
          </div>
        )}
        <div className="flex gap-2 mb-4">
          <BotonUtil
            label="Calcular"
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            onClick={handleCompute}
          />

          <BotonUtil
            label="Limpiar"
            className="px-4 py-2 border rounded"
            onClick={() => {
              setOutput([]);
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap  justify-center gap-4">
        <div className="mt-2 space-y-2">
          <h2 className="font-semibold">Pasos </h2>
          {output.length === 0 ? (
            <div className="text-muted">No hay cálculos todavía.</div>
          ) : (
            output.map((element, i) => (
              <div key={i} className="bg-black/20 p-2 rounded">
                {element}
              </div>
            ))
          )}
        </div>
        <div className="w-96">
          {chartDataAndOptions.datasets.length > 0 && (
            <div className="p-4 border rounded">
              <h2 className="font-semibold mb-2">Plano cartesiano</h2>
              <Scatter data={chartData} options={chartOptions} />
              <p className="text-xs mt-2">
                Colores: azul = V₁, verde = V₂, rojo = resultante /
                transformado. Escala automática.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
