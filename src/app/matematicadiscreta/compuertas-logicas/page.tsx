"use client";

import BotonBack from "@/utils/BotonBack";
import useMatematicaDiscreta from "@/hooks/useMatematicaDiscreta";
import { GateType } from "@/types/index";

const CompuertasLogicas: React.FC = () => {
  const { expr, setExpr, vars, table, gate, setGate, GateSymbol } =
    useMatematicaDiscreta();

  return (
    <section className="flex flex-col gap-2  min-h-screen bg-gray-100 p-4 ">
      <BotonBack />
      <h1 className="text-2xl font-semibold mb-4">
        Conversor de Compuertas y Expresiones Lógicas
      </h1>

      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <label className="block mb-2 font-medium">Expresión lógica:</label>
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-sm mt-1 opacity-70">
          Usa ¬ o ! para NOT, · o * para AND, + para OR, paréntesis para
          agrupar.
        </p>
      </div>

      <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="font-medium mb-3">Tabla de verdad</h2>
        <table className="border-collapse border w-full text-center">
          <thead>
            <tr>
              {vars.map((v: string) => (
                <th key={v} className="border px-3 py-1">
                  {v}
                </th>
              ))}
              <th className="border px-3 py-1">X</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={i}>
                {vars.map((v) => (
                  <td key={v} className="border px-3 py-1">
                    {row[v]}
                  </td>
                ))}
                <td className="border px-3 py-1 font-semibold">{row.X}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <label className="block mb-2 font-medium">
          Vista de compuerta individual:
        </label>
        <select
          value={gate}
          onChange={(e) => setGate(e.target.value as GateType)}
          className="border rounded px-3 py-2"
        >
          {(
            ["AND", "OR", "NOT", "XOR", "NAND", "NOR", "XNOR"] as GateType[]
          ).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="mt-4">
          <GateSymbol gate={gate} a={0} b={0} />
        </div>
      </div>
    </section>
  );
};

export default CompuertasLogicas;
