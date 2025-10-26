"use client";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonUtil from "@/utils/BotonUtil";
import TitleCourse from "@/components/TitleCourse";

export default function Ejemplo2Dinamico() {
  const {
    polyToLatex,
    linFactorLatex,
    toFracLatex,
    abs,
    input,
    setInput,
    setRun,
    data3,
    run,
  } = usePrecalculo();

  return (
    <div className="min-h-screen flex flex-col gap-2 p-4">
      <TitleCourse course="  Limites superiores e inferiores" />
      <div className="flex flex-col w-full items-center justify-center">
        <div className="flex flex-col w-full justify-center  gap-2 items-center">
          <input
            className="border rounded px-3 py-2 w-96 flex items-center justify-center text-center "
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un polinomio, p.ej.: 2x^5+5x^4-8x^3-14x^2+6x+9"
          />

          <InlineMath math={`P(x)=${polyToLatex(data3.coeffs0)}`} />
        </div>

        <BotonUtil
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => setRun(run + 1)}
          label="Calcular"
        />
      </div>
      <div className="flex flex-col items-center justify-center ">
        <h3 className="font-semibold">
          1. Aplicar el teorema de los ceros racionales
        </h3>
        <div className="flex flex-col gap-2 items-center justify-center text-center border rounded-md p-2">
          <p>
            <InlineMath
              math={`p = ${abs(
                data3.coeffs0[data3.coeffs0.length - 1]
              )} = \\pm ${data3.p.join(",\\, \\pm ")}`}
            />
          </p>
          <p>
            <InlineMath
              math={`q = ${abs(data3.coeffs0[0])} = \\pm ${data3.q.join(
                ",\\, \\pm "
              )}`}
            />
          </p>
          <p>
            <InlineMath
              math={`\\dfrac{p}{q} = ${data3.list
                .map((r) => toFracLatex(r))
                .join(",\\, ")}`}
            />
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2  items-center justify-center">
        {/* Tablas de división sintética (sólo pasos exitosos) */}
        {data3.synSteps.map((s, i) => {
          const rLatex = toFracLatex(s.divisor);
          return (
            <div
              key={i}
              className="flex flex-col items-center justify-center border p-2"
            >
              <p>
                Probando con <InlineMath math={`x = ${rLatex}`} />
              </p>

              <div className="inline-block rounded-lg overflow-hidden ">
                <table className=" text-sm">
                  <tbody>
                    <tr>
                      <td className="border px-3 py-2 text-center bg-gray-50 w-10">
                        <InlineMath math={rLatex} />
                      </td>
                      {s.top.map((c, idx) => (
                        <td key={idx} className="border px-3 py-2 text-center">
                          {c}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border px-3 py-2 text-center bg-gray-50" />
                      <td className="border px-3 py-2 text-center"> </td>
                      {s.middle.map((c, idx) => (
                        <td key={idx} className="border px-3 py-2 text-center">
                          {c}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border px-3 py-2 text-center bg-gray-50" />
                      {s.bottom.map((c, idx) => (
                        <td key={idx} className="border px-3 py-2 text-center">
                          {c}
                        </td>
                      ))}
                      <td className="border px-3 py-2 text-center">
                        {s.remainder}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <InlineMath math={`x = ${rLatex}`} /> sí es cero del polinomio,
                por lo tanto, este factor es{" "}
                <InlineMath math={`${linFactorLatex(s.divisor)}`} />.
              </p>

              {/* NOTA (cota superior) exactamente cuando corresponde */}
              {data3.upperBoundNoteIndex === i && (
                <p className="text-sm">
                  <b>NOTA:</b> observe que el cociente presenta todos sus
                  coeficientes positivos, por lo tanto,{" "}
                  <InlineMath math={`x = ${rLatex}`} /> es el límite superior de
                  los posibles ceros del polinomio, lo que quiere decir que, ya
                  no se deben evaluar valores mayores a este.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Cadena de igualdades como en la segunda imagen */}
      {data3.partials.length > 0 && (
        <div className="space-y-2">
          {data3.partials.map((eq, i) => (
            <BlockMath key={i} math={eq} />
          ))}
        </div>
      )}

      {/* Prueba adicional (cuando todavía queda un cúbico y hallamos otra raíz) ya incluida arriba.
          Ahora la "caja azul": factorizar el cuadrático final */}
      {data3.quadBox && (
        <div className="flex flex-col items-center  ">
          <div className="flex flex-col border p-2 rounded-md">
            <BlockMath math={data3.quadBox.eqLine} />
            {data3.quadBox.factLine && (
              <BlockMath math={data3.quadBox.factLine} />
            )}
          </div>
        </div>
      )}

      {/* Producto final exactamente como al final de la imagen */}
      {data3.finalLatex && (
        <div className="flex flex-col items-center justify-center">
          <BlockMath math={`P(x) = ${data3.finalLatex}`} />
          {/* Si hay factor repetido podemos mostrarlo con potencia compacta */}
          <div className="font-bold">
            <InlineMath
              math={`\\text{R:// el polinomio totalmente factorizado es } P(x) = ${data3.finalLatex}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
