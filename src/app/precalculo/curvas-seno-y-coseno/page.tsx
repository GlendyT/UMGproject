"use client";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import usePrecalculo from "@/hooks/usePrecalculo";
import TitleCourse from "@/components/TitleCourse";

const TrigDynamic: React.FC = () => {
  const { a3, setA3, k3, setK3, amplitude, periodo, data4 } = usePrecalculo();

  return (
    <div className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4">
      <TitleCourse course="Curvas Seno y Coseno" />

      {/* Fórmulas generales */}
      <div className="bg-gray-100 flex flex-wrap items-center justify-center gap-4">
        <BlockMath
          math={
            "y = a \\sin(kx) \\quad \\text{y} \\quad y = a \\cos(kx), \\quad k>0"
          }
        />
        <BlockMath math={"\\text{Amplitud} = |a|"} />
        <BlockMath math={"\\text{Período} = \\tfrac{2\\pi}{k}"} />
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium">a (amplitud)</label>
            <input
              type="number"
              value={a3}
              onChange={(e) => setA3(Number(e.target.value))}
              className="border p-2 rounded w-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">k (frecuencia)</label>
            <input
              type="number"
              step="0.1"
              value={k3}
              onChange={(e) => setK3(Number(e.target.value))}
              className="border p-2 rounded w-24"
            />
          </div>
        </div>
        <InlineMath math={`y = ${a3} \\sin${k3}x`} />
      </div>

      {/* Resultados dinámicos */}
      <div className=" flex flex-wrap items-center justify-center gap-4 ">
        <div className="font-medium w-auto border-r-2 p-1 text-center flex flex-col justify-center items-center">
          Amplitud:
          <InlineMath math={`|a| = |${a3}| = ${amplitude}`} />
        </div>

        <div className="font-medium w-auto p-1 text-center flex flex-col justify-center items-center">
          Período:
          <InlineMath
            math={`P = \\tfrac{2\\pi}{${k3}} \\approx ${periodo.toFixed(2)}`}
          />
        </div>
      </div>

      {/* Gráfica dinámica */}

      <div
        style={{
          width: "100%",
          height: 380,
          background: "white",
        }}
      >
        <h1 className="text-center font-extrabold">Gráfica</h1>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={900}
            height={300}
            data={data4}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              label={{
                value: "x (grados)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              label={{ value: "f(x)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrigDynamic;
