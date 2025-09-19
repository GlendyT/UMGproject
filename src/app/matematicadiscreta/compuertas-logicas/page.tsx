"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import useMatematicaDiscreta from "@/hooks/useMatematicaDiscreta";
import TitleCourse from "@/components/TitleCourse";

const CompuertasLogicas = () => {
  const { exprToLatex, setExpr, expr, vars, terms, table } =
    useMatematicaDiscreta();

  return (
    <section className="min-h-screen bg-gray-100 p-4 flex flex-col gap-4">
      <TitleCourse course="Conversor de Compuertas y Expresiones Lógicas" />
      <div className="grid md:grid-cols-2 gap-4">
        {/* Entrada */}
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <label className="block mb-2 font-medium">Expresión lógica:</label>
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Ej: A*C+B*!C+!A*B*C"
          />
          <p className="text-sm mt-2 opacity-70 leading-6">
            Usa <strong>¬</strong> o <strong>!</strong> para NOT (se mostrará
            como una barra encima)
            <br />
            Usa <strong>·</strong> o <strong>*</strong> para AND
            <br />
            Usa <strong>+</strong> para OR
            <br />
            Paréntesis para agrupar; variables en mayúsculas (A, B, C, …)
          </p>

          <div className="mt-4">
            <p className="font-medium mb-2">Desglose:</p>
            <BlockMath math={`X = ${terms.map(exprToLatex).join(" + ")}`} />
          </div>
        </div>

        {/* Tabla de verdad */}
        <div className="p-4 border rounded-lg bg-white shadow-sm overflow-auto">
          <h2 className="font-medium mb-3">Tabla de verdad (con pasos)</h2>
          <table className="border-collapse border w-full text-center text-sm">
            <thead>
              <tr>
                {vars.map((v) => (
                  <th key={v} className="border px-3 py-1 bg-gray-50">
                    <BlockMath math={v} />
                  </th>
                ))}
                {terms.map((t) => (
                  <th key={t} className="border px-3 py-1 bg-blue-50">
                    <BlockMath math={exprToLatex(t)} />
                  </th>
                ))}
                <th className="border px-3 py-1 bg-green-50">
                  <BlockMath math={"X"} />
                </th>
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
                  {terms.map((t) => (
                    <td key={t} className="border px-3 py-1 font-semibold">
                      {row[t]}
                    </td>
                  ))}
                  <td className="border px-3 py-1 font-bold">{row.X}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs mt-2 opacity-70">
            Las negaciones se muestran con barra arriba: por ejemplo{" "}
            <BlockMath math="\overline{A}" /> = NOT A
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompuertasLogicas;
