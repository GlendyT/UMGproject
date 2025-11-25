"use client";
import { BlockMath } from "react-katex";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "katex/dist/katex.min.css";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonUtil from "@/utils/BotonUtil";
import TitleCourse from "@/components/TitleCourse";

const QuadraticSolver = () => {
  const {
    a,
    b,
    c,
    setA,
    setB,
    setC,
    useFractions,
    setUseFractions,
    paso1,
    paso2,
    paso3,
    paso4,
    paso5,
    extremo,
    h,
    k,
    formatNumber,
    data,
  } = usePrecalculo();

  return (
    <div className="min-h-screen flex flex-col px-6 py-2 gap-0">
      <TitleCourse course=" Ecuaciones de segundo grado con gráficas" />

      <div className="flex flex-col  w-full items-center justify-center text-center">
        <h2 className="text-xl font-bold max-sm:text-xs">
          <BlockMath math={paso1} />
        </h2>
        <div className="flex flex-row items-center gap-2">
          <label>
            a:{" "}
            <input
              type="number"
              className="border p-1 rounded w-20"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
            />
          </label>
          <label>
            b:{" "}
            <input
              type="number"
              className="border p-1 rounded w-20"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
            />
          </label>
          <label>
            c:{" "}
            <input
              type="number"
              className="border p-1 rounded w-20"
              value={c}
              onChange={(e) => setC(Number(e.target.value))}
            />
          </label>
          <BotonUtil
            label={useFractions ? "Dec." : "Frac."}
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs"
            onClick={() => setUseFractions(!useFractions)}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center w-full gap-2">
        {/* Paso 1: Forma normal */}
        <div className="flex flex-col items-center justify-center w-auto ">
          <h3 className="font-bold text-lg">
            1. Expresar f(x) en su forma normal
          </h3>
          <div className="border-2 rounded-md p-2 w-full ">
            <BlockMath math={paso1} />
            <BlockMath math={paso2} />
            <BlockMath math={paso3} />
            <BlockMath math={paso4} />
            <BlockMath math={paso5} />
            <BlockMath
              math={`\\text{Vértice: } (${formatNumber(h)}, ${formatNumber(
                k
              )})`}
            />
          </div>
        </div>

        {/* Paso 2: Máximo o mínimo */}
        <div className="flex flex-col items-center  w-auto">
          <h3 className="font-bold text-lg">
            2. Encontrar valores máximos y/o mínimos
          </h3>
          <div className="border-2 rounded-md p-2 w-full ">
            <BlockMath math={`x = -\\frac{b}{2a}`} />
            <BlockMath
              math={`x = -\\frac{${b}}{2(${a})} = ${formatNumber(h)}`}
            />
            <BlockMath math={`f(${formatNumber(h)}) = ${formatNumber(k)}`} />
            <BlockMath
              math={`\\text{Dado que } a = ${a} \\; ${
                a > 0 ? ">" : "<"
              } \\; 0, \\text{ se tiene un ${extremo} en } f(${formatNumber(
                h
              )}) = ${formatNumber(k)}`}
            />
          </div>
        </div>

        {/* Gráfica */}
        <div className="w-full h-auto border-2 rounded-md p-2 ">
          <h3 className="font-bold text-lg">3. Gráfica de la parábola</h3>
          <div className="w-auto h-[420px]">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" domain={["auto", "auto"]} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#2563eb"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadraticSolver;
